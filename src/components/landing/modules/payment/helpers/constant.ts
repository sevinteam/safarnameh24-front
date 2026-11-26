import { IconsName } from '@/types';

// ------------------------------

export const payment = {
  NUMBER_OF_STEPS: 4,
  descriptionKey: 'reservation-description',
  reservationId: 'tracking-code',
  stepper: [
    { icon: 'Buildings' as IconsName, step: 'اول', title: 'بررسی ظرفیت اتاق' },
    {
      icon: 'Profile2User' as IconsName,
      step: 'دوم',
      title: 'تکمیل مشخصات مسافران',
    },
    { icon: 'EmptyWallet' as IconsName, step: 'سوم', title: 'پرداخت وجه' },
    { icon: 'Receipt21' as IconsName, step: 'چهارم', title: 'صدور واچر' },
  ],
  person: {
    first_name: '',
    last_name: '',
    phone_number: '',
    national_code: '',
  },
  passengersNoteBook: [
    {
      first_name: 'پرهام',
      last_name: 'رحیمی',
      phone_number: '09912346595',
      national_code: '0024773662',
    },
    {
      first_name: 'علیرضا',
      last_name: 'آذرخش آلوچه',
      phone_number: '09912346595',
      national_code: '0024773662',
    },
    {
      first_name: 'امیرحسین',
      last_name: 'لامعی',
      phone_number: '09912346595',
      national_code: '0024773662',
    },
    {
      first_name: 'سید حسین',
      last_name: 'فتح اللهی',
      phone_number: '09912346595',
      national_code: '0024773662',
    },
    {
      first_name: 'متین',
      last_name: 'هدایت',
      phone_number: '09399862846',
      national_code: '0023273291',
    },
    {
      first_name: 'ساشا',
      last_name: 'آذرخش',
      phone_number: '09155525185',
      national_code: '0023467444',
    },
  ],
  rooms: [
    {
      id: 5,
      name: 'یک تخته (اقامت 7 ساعته)',
      capacity: 1,
      extra_capacity: 0,
      discount_on_purchase: 2_000_000,
      extra_capacity_price: 1_500_000,
      half_charges: {
        enter: { enabled: false, price: 0 },
        exit: { enabled: false, price: 0 },
      },
      passengers: {
        main_passenger: {
          first_name: '',
          last_name: '',
          phone_number: '',
          national_code: '',
        },
        other_passengers: [
          // {
          //   first_name: '',
          //   last_name: '',
          //   national_code: '',
          // },
        ],
        extra_capacity_passengers: [],
      },
    },
    {
      id: 5,
      name: 'یک تخته (اقامت 7 ساعته)',
      capacity: 3,
      extra_capacity: 2,
      discount_on_purchase: 2_000_000,
      extra_capacity_price: 1_500_000,
      half_charges: {
        enter: { enabled: false, price: 2_000_000 },
        exit: { enabled: false, price: 3_000_000 },
      },
      passengers: {
        main_passenger: {
          first_name: '',
          last_name: '',
          phone_number: '',
          national_code: '',
        },
        other_passengers: [
          {
            first_name: '',
            last_name: '',
            national_code: '',
          },
          {
            first_name: '',
            last_name: '',
            national_code: '',
          },
        ],
        extra_capacity_passengers: [],
      },
    },
  ],
  checkReservationInfo: {
    confirmed: {
      title: 'اطلاعات رزرو شما با موفقیت تایید شد',
      desc: 'مشتری گرامی درخواست رزرو شما مورد تایید میباشد , در ادامه اقدام به پرداخت صورتحساب نمایید .',
    },
    rejected: {
      title: 'اطلاعات رزرو شما تایید نشد !',
      desc: 'مشتری گرامی درخواست رزرو شما به دلیل عدم ظرفیت یا اطلاعات اشتباه مورد تایید نمیباشد .',
    },
    error: {
      title: 'خطایی رخ داده است !',
      desc: 'مشتری گرامی درخواست رزرو شما با مشکلی روبرو شده است , لطفا  مجدد تلاش فرمایید .',
    },
  },
};
