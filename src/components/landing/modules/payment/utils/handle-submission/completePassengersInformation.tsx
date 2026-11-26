import { axiosInstance } from '@/utils/axios';
import { FormSchema } from '../../helpers/type';
import { payment } from '../../helpers/constant';
import { showCMToast } from '@/components/landing/shared/toast';
import { hasAuthHint } from '@/utils/authCookies';

// بررسی دقیق و ایمن وضعیت لاگین بودن مسافر
function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return hasAuthHint();
}

// ------------------------------

export async function handleSubmit(
  data: FormSchema,
  trackingCode: string | null,
  handleNavigateTo: (url: string) => void,
  handleToggleLoading: () => void,
  handleInvalidateQuery: () => void,
) {
  // ۱. اگر کاربر لاگین نبود، فرم ذخیره شده و درخواست ورود می‌دهد
  if (!isUserLoggedIn()) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'pending_passenger_form',
        JSON.stringify({ trackingCode, formData: data }),
      );
      window.dispatchEvent(new Event('open-auth-modal'));
    }

    showCMToast({
      type: 'error',
      title: 'ورود به حساب کاربری',
      description: 'جهت تایید و ادامه فرآیند، لطفاً ابتدا وارد حساب کاربری خود شوید.',
    });
    return;
  }

  // ۲. در صورت لاگین بودن، اطلاعات مسافران ثبت و به صفحه بازبینی و تایید اطلاعات هدایت می‌شود
  try {
    handleToggleLoading();

    // ثبت اطلاعات مسافران و اتاق‌ها
    await axiosInstance.put(`/hotel/reservation/form/${trackingCode}/`, data);

    // ثبت توضیحات (به صورت محافظت‌شده و اختیاری تا هرگز مانع ادامه فرآیند نشود)
    try {
      const description =
        typeof window !== 'undefined'
          ? sessionStorage.getItem(payment.descriptionKey) || ''
          : '';

      await axiosInstance.put(`/hotel/reservation/description/${trackingCode}/`, {
        description,
      });
    } catch (descError) {
      console.warn('Description optional error (ignored):', descError);
    }

    handleInvalidateQuery();

    const confirmUrl = trackingCode
      ? `/payment/confirm-information?${payment.reservationId}=${trackingCode}`
      : '/payment/confirm-information';
    handleNavigateTo(confirmUrl);
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'کاربر گرامی در ثبت اطلاعات مسافران مشکلی بوجود آمد';

    showCMToast({
      type: 'error',
      title: 'ثبت اطلاعات با خطا مواجه شد !',
      description: errorMsg,
    });
  } finally {
    handleToggleLoading();
  }
}

export async function proceedToPaymentGateway(
  trackingCode: string | null,
  handleNavigateTo: (url: string) => void,
  handleToggleLoading: () => void,
) {
  if (!trackingCode) return;

  if (!isUserLoggedIn()) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-auth-modal'));
    }
    showCMToast({
      type: 'error',
      title: 'ورود به حساب کاربری',
      description: 'جهت انتقال به درگاه پرداخت، لطفاً وارد حساب کاربری خود شوید.',
    });
    return;
  }

  try {
    handleToggleLoading();

    const payResponse = await axiosInstance.post(
      `/payment/reservation-check/${trackingCode}/`,
    );
    const res = payResponse?.data?.data || payResponse?.data;

    if (res?.paid_by_wallet) {
      handleNavigateTo(
        `/payment/watcher-info?Status=OK&${payment.reservationId}=${trackingCode}&Authority=wallet_${trackingCode}&refId=wallet_${trackingCode}`,
      );
      return;
    }

    if (res?.ok && res?.payment_link) {
      if (
        res.payment_link.startsWith('http://') ||
        res.payment_link.startsWith('https://')
      ) {
        window.location.href = res.payment_link;
      } else {
        handleNavigateTo(res.payment_link);
      }
      return;
    }

    handleNavigateTo(
      `/payment/watcher-info?Status=OK&${payment.reservationId}=${trackingCode}`,
    );
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'کاربر گرامی در اتصال به درگاه پرداخت مشکلی بوجود آمد';

    showCMToast({
      type: 'error',
      title: 'اتصال به درگاه با خطا مواجه شد !',
      description: errorMsg,
    });
  } finally {
    handleToggleLoading();
  }
}