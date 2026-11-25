#!/usr/bin/env bash
[ -n "${ZSH_VERSION:-}" ] && exec bash "$0" "$@"
set -euo pipefail

TARGET_BRANCH="${1:-safarnameh24}"
SCRIPT_NAME="$(basename "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ اینجا پوشه گیت نیست!"
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"
if [ -z "${CURRENT_BRANCH}" ]; then
  echo "❌ در حال حاضر روی هیچ برنچی نیستید (Detached HEAD)."
  exit 1
fi

if [ "${CURRENT_BRANCH}" = "${TARGET_BRANCH}" ]; then
  echo "⚠️ شما همین الان هم روی برنچ ${TARGET_BRANCH} هستید!"
  exit 1
fi

# جلوگیری از stash شدن یا پاک شدن خودِ اسکریپت هنگام جابجایی برنچ (بدون دستکاری .gitignore)
EXCLUDE_FILE="$(git rev-parse --git-path info/exclude)"
mkdir -p "$(dirname "${EXCLUDE_FILE}")"
if ! grep -qxF "${SCRIPT_NAME}" "${EXCLUDE_FILE}" 2>/dev/null; then
  echo "${SCRIPT_NAME}" >> "${EXCLUDE_FILE}"
fi

FILES=()
add_unique_file() {
  local candidate="$1"
  [ -z "${candidate}" ] && return
  [ "${candidate}" = "${SCRIPT_NAME}" ] && return
  local existing
  for existing in "${FILES[@]+"${FILES[@]}"}"; do
    [ "${existing}" = "${candidate}" ] && return
  done
  FILES+=("${candidate}")
}

# ۱. فایل‌های تغییر یافته و جدید فعلی (Uncommitted / Untracked)
while IFS= read -r line; do
  [ -z "${line}" ] && continue
  status_code="${line:0:2}"
  file_path="${line:3}"
  if [[ "${status_code}" == R* ]] && [[ "${file_path}" == *" -> "* ]]; then
    file_path="${file_path##* -> }"
  fi
  file_path="${file_path#\"}"
  file_path="${file_path%\"}"
  add_unique_file "${file_path}"
done < <(git -c core.quotePath=false status --porcelain -uall)

# ۲. فایل‌های کامیت‌شده در ۲۴ ساعت اخیر روی برنچ فعلی
while IFS= read -r line; do
  [ -z "${line}" ] && continue
  add_unique_file "${line}"
done < <(git -c core.quotePath=false log --since="24 hours ago" --name-only --pretty=format:"" 2>/dev/null || true)

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "ℹ️ هیچ فایل تغییریافته‌ای در تغییرات فعلی یا ۲۴ ساعت اخیر پیدا نشد."
  exit 0
fi

TMP_DIR="$(mktemp -d /tmp/git_transfer.XXXXXX)"
cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

PICKER_JS="${TMP_DIR}/picker.cjs"
cat << 'NODE_EOF' > "${PICKER_JS}"
const files = process.argv.slice(2);
const selected = new Set();
let cursor = 0;
const PAGE_SIZE = 16;

const write = (str) => process.stderr.write(str);

if (!process.stdin.isTTY) {
  write('❌ ترمینال تعاملی نیست.\n');
  process.exit(1);
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

function render() {
  write('\x1b[2J\x1b[H');
  write(`\x1b[1m📦 فایل‌های تغییر یافته:\x1b[0m\n`);
  write(`\x1b[2m↑/↓ حرکت  |  Space تیک زدن  |  a همه/هیچ‌کدام  |  Enter انتقال  |  q خروج\x1b[0m\n\n`);

  const start = Math.max(0, Math.min(cursor - Math.floor(PAGE_SIZE / 2), Math.max(0, files.length - PAGE_SIZE)));
  const end = Math.min(files.length, start + PAGE_SIZE);

  if (start > 0) write(`\x1b[2m  ... (${start} فایل بالاتر)\x1b[0m\n`);

  for (let i = start; i < end; i++) {
    const isCursor = i === cursor;
    const isChecked = selected.has(i);
    const pointer = isCursor ? '\x1b[36m❯\x1b[0m' : ' ';
    const box = isChecked ? '\x1b[32m[✓]\x1b[0m' : '\x1b[2m[ ]\x1b[0m';
    const name = isCursor ? `\x1b[1;36m${files[i]}\x1b[0m` : files[i];
    write(`${pointer} ${box} ${name}\n`);
  }

  if (end < files.length) write(`\x1b[2m  ... (${files.length - end} فایل پایین‌تر)\x1b[0m\n`);
  write(`\n\x1b[33mتعداد انتخاب شده: ${selected.size} از ${files.length}\x1b[0m\n`);
}

function finish(code, output = '') {
  try { process.stdin.setRawMode(false); } catch {}
  process.stdin.pause();
  write('\x1b[2J\x1b[H');
  if (output) process.stdout.write(output);
  process.exit(code);
}

render();

process.stdin.on('data', (key) => {
  if (key === '\u0003' || key === 'q' || key === 'Q') {
    finish(1);
  } else if (key === '\u001b[A' || key === 'k' || key === 'w') {
    cursor = (cursor - 1 + files.length) % files.length;
    render();
  } else if (key === '\u001b[B' || key === 'j' || key === 's') {
    cursor = (cursor + 1) % files.length;
    render();
  } else if (key === ' ') {
    if (selected.has(cursor)) selected.delete(cursor);
    else selected.add(cursor);
    render();
  } else if (key === 'a' || key === 'A') {
    if (selected.size === files.length) selected.clear();
    else files.forEach((_, i) => selected.add(i));
    render();
  } else if (key === '\r' || key === '\n') {
    const out = files.filter((_, i) => selected.has(i)).join('\n');
    finish(0, out ? out + '\n' : '');
  }
});
NODE_EOF

SELECTED_RAW="$(node "${PICKER_JS}" "${FILES[@]}")" || {
  echo "🚫 عملیات لغو شد."
  exit 0
}

SELECTED_FILES=()
while IFS= read -r f; do
  [ -z "${f}" ] && continue
  SELECTED_FILES+=("${f}")
done <<< "${SELECTED_RAW}"

if [ "${#SELECTED_FILES[@]}" -eq 0 ]; then
  echo "⚠️ هیچ فایلی تیک نخورد."
  exit 0
fi

# ذخیره نسخه فعلی فایل‌های انتخاب‌شده در پوشه موقت
SNAPSHOT_DIR="${TMP_DIR}/snapshot"
mkdir -p "${SNAPSHOT_DIR}"
DELETED_FILES=()

for f in "${SELECTED_FILES[@]}"; do
  if [ -e "${f}" ]; then
    mkdir -p "${SNAPSHOT_DIR}/$(dirname "${f}")"
    cp "${f}" "${SNAPSHOT_DIR}/${f}"
  else
    DELETED_FILES+=("${f}")
  fi
done

# ذخیره موقت تغییرات فعلی برنچ مبدا برای جابجایی امن برنچ
DID_STASH=0
if [ -n "$(git status --porcelain)" ]; then
  echo "📦 در حال ذخیره موقت تغییرات ${CURRENT_BRANCH}..."
  git stash push -u -m "temp-transfer-to-${TARGET_BRANCH}" >/dev/null
  DID_STASH=1
fi

echo "🔄 در حال رفتن به برنچ ${TARGET_BRANCH}..."
git fetch origin >/dev/null 2>&1 || true

if git show-ref --verify --quiet "refs/heads/${TARGET_BRANCH}"; then
  git checkout "${TARGET_BRANCH}"
elif git show-ref --verify --quiet "refs/remotes/origin/${TARGET_BRANCH}"; then
  git checkout -b "${TARGET_BRANCH}" "origin/${TARGET_BRANCH}"
else
  echo "❌ برنچ ${TARGET_BRANCH} نه در لوکال و نه در origin پیدا نشد!"
  git checkout "${CURRENT_BRANCH}"
  [ "${DID_STASH}" -eq 1 ] && git stash pop >/dev/null || true
  exit 1
fi

if git show-ref --verify --quiet "refs/remotes/origin/${TARGET_BRANCH}"; then
  git pull origin "${TARGET_BRANCH}" || true
fi

# اعمال فایل‌های تیک‌خورده روی برنچ مقصد
for f in "${SELECTED_FILES[@]}"; do
  if [ -e "${SNAPSHOT_DIR}/${f}" ]; then
    mkdir -p "$(dirname "${f}")"
    cp "${SNAPSHOT_DIR}/${f}" "${f}"
  fi
done

for f in "${DELETED_FILES[@]+"${DELETED_FILES[@]}"}"; do
  git rm -f "${f}" >/dev/null 2>&1 || rm -f "${f}"
done

echo ""
echo "✅ ${#SELECTED_FILES[@]} فایل انتخاب‌شده به برنچ ${TARGET_BRANCH} منتقل شد:"
git status -s
echo ""

read -r -p "آیا روی ${TARGET_BRANCH} کامیت و پوش کنم و برگردم روی ${CURRENT_BRANCH} (y/n): " DO_PUSH
if [[ "${DO_PUSH}" =~ ^[Yy]$ ]]; then
  read -r -p "پیام کامیت (Enter برای پیش‌فرض): " COMMIT_MSG
  COMMIT_MSG="${COMMIT_MSG:-Sync selected frontend updates from ${CURRENT_BRANCH}}"
  git add -- "${SELECTED_FILES[@]}"
  if git diff --cached --quiet; then
    echo "ℹ️ تغییری نسبت به وضعیت فعلی ${TARGET_BRANCH} وجود نداشت."
  else
    git commit -m "${COMMIT_MSG}"
    git push origin "${TARGET_BRANCH}"
    echo "🚀 با موفقیت روی ${TARGET_BRANCH} پوش شد!"
  fi
  git checkout "${CURRENT_BRANCH}"
  if [ "${DID_STASH}" -eq 1 ]; then
    git stash pop >/dev/null || echo "⚠️ تغییرات قبلی شما در git stash هست (برای بازیابی بزنید: git stash pop)"
  fi
else
  echo "⏸️ الان روی برنچ ${TARGET_BRANCH} هستید تا فایل‌ها را بررسی کنید."
  [ "${DID_STASH}" -eq 1 ] && echo "ℹ️ تغییرات برنچ ${CURRENT_BRANCH} امن در git stash نگهداری شده‌اند."
fi
