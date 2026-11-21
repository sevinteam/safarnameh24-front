import logoImage from '@/assets/images/logo/logo.png';
import iconImage from '@/assets/images/logo/icon.png';

import telegram from '@/assets/images/social-media/pack-2/telegram.svg';
import whatsapp from '@/assets/images/social-media/pack-2/whatsapp.svg';
import linkedin from '@/assets/images/social-media/pack-2/linkedin.svg';
import instagram from '@/assets/images/social-media/pack-2/instagram.svg';

import { Mail, MapPin, PhoneCall } from 'lucide-react';

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

  social_media: [
    {
      label: {
        en: 'telegram',
        fa: 'تلگرام',
      },
      image: {
        src: telegram,
        alt: '',
      },
      href: '#',
      icon: undefined,
      type: 'telegram',
    },
    {
      label: {
        en: 'instagram',
        fa: 'اینستاگرام',
      },
      image: {
        src: instagram,
        alt: '',
      },
      href: 'https://www.instagram.com/sevinhostir/',
      type: 'instagram',
      icon: undefined,
    },
    {
      label: {
        en: 'whatsapp',
        fa: 'واتساپ',
      },
      image: {
        src: whatsapp,
        alt: '',
      },
      href: '#',
      type: 'whatsapp',
      icon: undefined,
    },
    {
      label: {
        en: 'linkedin',
        fa: 'لینکدین',
      },
      image: {
        src: linkedin,
        alt: '',
      },
      href: '#',
      type: 'linkedin',
      icon: undefined,
    },
  ],

  contacts: [
    {
      icon: PhoneCall,
      image: undefined,
      type: 'phone-number',
      value: '021-91301614',
      label: 'شماره تماس شرکت',
      actionLabel: 'تماس با ما',
      href: 'tel:02191301614',
    },
    {
      icon: PhoneCall,
      image: undefined,
      type: 'phone-number',
      value: '09120759419',
      label: 'شماره تماس همراه',
      actionLabel: 'تماس با ما',
      href: 'tel:09120759419',
    },
    {
      icon: Mail,
      image: undefined,
      type: 'email',
      label: 'ایمیل',
      value: 'info@my.sevinhost.ir',
      actionLabel: 'ارسال ایمیل',
      href: 'mailto:info@my.sevinhost.ir',
    },
    {
      icon: MapPin,
      image: undefined,
      type: 'address',
      label: 'دفتر مرکزی',
      value:
        'تهران - جنت آباد مرکزی شاهین شمالی بیست متری گلستان شرقی کوچه معینی نبش رحیم بزی پلاک ۲۰ واحد ۲۰',
      actionLabel: undefined,
      href: undefined,
    },
  ],

  version: '1.0.0',
  versionName: 'alpha-refactored',
} as const;
