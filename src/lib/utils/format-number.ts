/**
 * فرمت‌بندی و گروه‌بندی اعداد و رشته‌های عددی (از راست به چپ)
 *
 * @param value عدد یا رشته ورودی
 * @param chunkSize تعداد ارقام در هر بخش (پیش‌فرض: ۳)
 * @param separator کاراکتر جداکننده (پیش‌فرض: ",")
 * @returns رشته فرمت‌شده
 */
export function formatNumber(
  value: number | string | null | undefined,
  chunkSize: number = 3,
  separator: string = ',',
): string {
  // ۱. بررسی مقادیر خالی یا نال
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const strValue = String(value).trim();

  // ۲. مدیریت علامت منفی
  const isNegative = strValue.startsWith('-');
  const unsignedStr = isNegative ? strValue.slice(1) : strValue;

  // ۳. جداسازی بخش صحیح و بخش اعشاری (در صورت وجود)
  const [rawInteger, decimalPart] = unsignedStr.split('.');

  // ۴. حذف کاراکترهای غیرعددی احتمالی از بخش صحیح (مثل کاماهای قبلی)
  const integerPart = rawInteger.replace(/\D/g, '');

  // اگر ورودی هیچ رقمی نداشت
  if (!integerPart && decimalPart === undefined) {
    return '';
  }

  // ۵. اعمال جداکننده به بخش صحیح (با ریجکس داینامیک بر مبنای chunkSize)
  let formattedInteger = integerPart;
  if (chunkSize > 0) {
    const regex = new RegExp(`\\B(?=(\\d{${chunkSize}})+(?!\\d))`, 'g');
    formattedInteger = integerPart.replace(regex, separator);
  }

  // ۶. ترکیب مجدد بخش اعشاری و علامت منفی
  const result =
    decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;

  return isNegative ? `-${result}` : result;
}
