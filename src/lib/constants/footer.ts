import { SITE_CONFIG } from '@/config/site';

// ------------------------------

export const content = {
  description: `
          پلتفرم گردشگری از سال ۱۳۹۷ با ارائه خدمات نوین میزبانی وب، سرورهای ابری و پشتیبانی ۲۴ ساعته، زیرساختی امن، پایدار و پرسرعت را برای رشد کسب‌وکارهای آنلاین فراهم کرده است.
          تجربه میزبانی باکیفیت و بی‌دغدغه با پلتفرم گردشگری؛ ارائه‌دهنده راهکارهای تخصصی هاست، سرور و دامنه با امنیت حداکثری و تکیه بر دانش متخصصین ایرانی از سال ۱۳۹۷.
          پلتفرم گردشگری؛ پیشرو در ارائه خدمات ابری و میزبانی وب با آپ‌تایم بالا و پشتیبانی شبانه‌روزی، همراه هوشمند و همیشگی کسب‌وکار شما در مسیر توسعه و موفقیت.
              `,

  licenses: {
    enamad: '',
    licenses: [
      {
        label: 'نماد اعتماد الکترونیکی',
        href: '#',
        image: SITE_CONFIG.logo.secondary,
      },
      {
        label: 'نماد اعتماد الکترونیکی',
        href: '#',
        image: SITE_CONFIG.logo.secondary,
      },
      {
        label: 'نماد اعتماد الکترونیکی',
        href: '#',
        image: SITE_CONFIG.logo.secondary,
      },
      {
        label: 'نماد اعتماد الکترونیکی',
        href: '#',
        image: SITE_CONFIG.logo.secondary,
      },
    ],
  },

  accessLinks: [
    {
      title: 'حساب کاربری',
      links: [
        {
          label: 'ورود به حساب',
          href: '/login',
        },
        {
          label: 'ثبت‌نام',
          href: '/register',
        },
        {
          label: 'پنل کاربری',
          href: '/account',
        },
        {
          label: 'سفارش‌های من',
          href: '/account/orders',
        },
      ],
    },
    {
      title: 'پشتیبانی',
      links: [
        {
          label: 'مرکز پشتیبانی',
          href: '/support',
        },
        {
          label: 'تیکت‌های من',
          href: '/support/tickets',
        },
        {
          label: 'سوالات متداول',
          href: '/faq',
        },
        {
          label: 'تماس با ما',
          href: '/contact-us',
        },
      ],
    },
    {
      title: 'اطلاعات',
      links: [
        {
          label: 'درباره ما',
          href: '/about-us',
        },
        {
          label: 'قوانین و مقررات',
          href: '/terms',
        },
        {
          label: 'حریم خصوصی',
          href: '/privacy',
        },
        {
          label: 'وبلاگ',
          href: '/blog',
        },
      ],
    },
  ],
};
