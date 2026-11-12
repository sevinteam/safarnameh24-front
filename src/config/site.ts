import logoImg from '@/assets/images/logo/logo.png';
import logoImgSecondary from '@/assets/images/logo/logo-2.png';

// ------------------------------

export const SITE_CONFIG = {
  name: 'پلتفرم گردشگری',
  nameEn: 'Travel Platform',

  slogan: 'آژانس مسافرتی پلتفرم گردشگری',
  sloganEn: 'Travel platform booking agency',

  description: `پلتفرم گردشگری از سال ۱۳۹۷ با ارائه خدمات نوین میزبانی وب، سرورهای ابری و پشتیبانی ۲۴ ساعته، زیرساختی امن، پایدار و پرسرعت را برای رشد کسب‌وکارهای آنلاین فراهم کرده است. تجربه میزبانی باکیفیت و بی‌دغدغه با پلتفرم گردشگری؛ ارائه‌دهنده راهکارهای تخصصی هاست، سرور و دامنه با امنیت حداکثری و تکیه بر دانش متخصصین ایرانی از سال ۱۳۹۷. پلتفرم گردشگری؛ پیشرو در ارائه خدمات ابری و میزبانی وب با آپ‌تایم بالا و پشتیبانی شبانه‌روزی، همراه هوشمند و همیشگی کسب‌وکار شما در مسیر توسعه و موفقیت.`,

  logo: {
    main: logoImg,
    secondary: logoImgSecondary,
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
