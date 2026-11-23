// Toggles an item inside an immutable array (add if absent, remove if present)
export function toggleArrayItem<T>(list: readonly T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((entry) => entry !== item)
    : [...list, item];
}
