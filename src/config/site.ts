import logoImage from '@/assets/images/logo/logo.png';
import iconImage from '@/assets/images/logo/icon.png';

// ------------------------------

export const SITE_CONFIG = {
  name: 'سفرنامه 24',
  nameEn: 'Safarnameh-24',

  slogan: 'آژانس مسافرتی سفرنامه 24',
  sloganEn: 'Safarnameh-24 booking agency',

  description: `سفرنامه 24 از سال ۱۳۹۷ با ارائه خدمات نوین میزبانی وب، سرورهای ابری و پشتیبانی ۲۴ ساعته، زیرساختی امن، پایدار و پرسرعت را برای رشد کسب‌وکارهای آنلاین فراهم کرده است. تجربه میزبانی باکیفیت و بی‌دغدغه با سفرنامه 24؛ ارائه‌دهنده راهکارهای تخصصی هاست، سرور و دامنه با امنیت حداکثری و تکیه بر دانش متخصصین ایرانی از سال ۱۳۹۷. سفرنامه 24؛ پیشرو در ارائه خدمات ابری و میزبانی وب با آپ‌تایم بالا و پشتیبانی شبانه‌روزی، همراه هوشمند و همیشگی کسب‌وکار شما در مسیر توسعه و موفقیت.`,

  logo: {
    main: logoImage,
    secondary: logoImage,

    icon: iconImage,
  },

  locale: 'fa-IR',
  direction: 'rtl',

  contact: {
    phone: '',
    email: '',
    address: '',
    zipCode: '',
  },

  socialMedia: {
    instagram: '',
    telegram: '',
    linkedin: '',
    whatsapp: '',
  },

  version: '1.0.0',
  versionName: 'alpha-refactored',
} as const;
