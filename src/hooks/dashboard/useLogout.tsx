import useApiMutation from './useApiMutation';
import toast from '@/components/dashboard/ui/customSonner/toast';
import useLocalStorageState from 'use-local-storage-state';
import {
  clearAuthCookies,
  clearAuthTokens,
  getStoredRefreshToken,
} from '@/utils/authCookies';

// Creating and exporting useLogout custom hooks
export default function useLogout() {
  // Defining inner hooks
  const ticketWalpaper = useLocalStorageState<string>('ticketWalpaper');
  const ticketTheme = useLocalStorageState<string>('ticketTheme');
  const openedNotifications = useLocalStorageState<number[]>(
    'openedNotifications',
  );

  const ticketNotifications = useLocalStorageState<boolean>(
    'ticketNotifications',
  );

  const profileState = useLocalStorageState<'personal' | 'legal'>(
    'profilePageActiveTab',
  );

  // Handling api requests
  const mutation = useApiMutation({
    url: '/auth/logout/',
    method: 'post',
    options: {
      onError: () => {
        toast({
          title: 'خطا در دریافت اطلاعات',
          description:
            'در دریافت داده‌ها مشکلی به‌وجود آمده است. لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.',
          theme: 'theme',
        });
      },
      onSuccess: () => {
        openedNotifications[2].removeItem();
        ticketWalpaper[2].removeItem();
        ticketTheme[2].removeItem();
        ticketNotifications[2].removeItem();
        clearAuthTokens();
        clearAuthCookies();
        sessionStorage.removeItem("upn");

        window.location.pathname = '/';
      }
    },
  });

  return {
    mutate: () =>
      mutation.mutate({
        refresh_token: getStoredRefreshToken(),
      }),
    loading: mutation.isPending,
  };
}
