import { Metadata } from 'next';
import {
  SendTicket,
  SocialMedias,
  ContactUsWays,
} from '@/components/landing/modules/contact-us';

export const metadata: Metadata = {
  title: 'تماس با سفرنامه ۲۴  | پشتیبانی و ارتباط با ما',
  description: 'برای ارتباط با تیم پشتیبانی سفرنامه ۲۴ ، پیگیری رزرو هتل و ارسال تیکت با ما در تماس باشید. ما آماده پاسخگویی به سوالات شما هستیم.',
  keywords: ['تماس با سفرنامه ۲۴ ', 'پشتیبانی سفرنامه ۲۴ ', 'شماره تماس سفرنامه ۲۴ ', 'ارسال تیکت به سفرنامه ۲۴ ', 'خدمات مشتریان سفرنامه ۲۴ '],
  alternates: {
    canonical: 'https://safarnameh24.com/contact-us',
  },
  openGraph: {
    title: 'تماس با ما | سفرنامه ۲۴  - همراه شما در سفر',
    description: 'راهنمای ارتباط با سفرنامه ۲۴ ؛ پشتیبانی آنلاین و شماره تماس برای رزرو هتل.',
    url: 'https://safarnameh24.com/contact-us',
    type: 'website',
  },
};

export default function ContactUs() {
  return (
    <main className="mt-4 flex flex-col gap-12 lg:gap-20 xl:mt-12">
      {/* 
         نکته سئو: حتماً در کامپوننت ContactUsWays یک تگ <h1> قرار دهید
         مثلاً: <h1>تماس با پشتیبانی سفرنامه ۲۴ </h1>
      */}
      <ContactUsWays />
      <SocialMedias />
      <SendTicket />
    </main>
  );
}