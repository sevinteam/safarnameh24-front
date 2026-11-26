import Link from 'next/link';
import loader from '@/styles/loader.module.css';

import { LogIn } from 'lucide-react';
import { VscError } from 'react-icons/vsc';
import { FaRegLightbulb } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';

type Props = {
  isEmpty: boolean;
  isAuthenticated: boolean;
  onOpenLogin?: () => void;
  hasSearchQuery?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  children: React.ReactNode;
  status: 'pending' | 'error' | 'success';
};

// ------------------------------

export function PassengersNotebookList(props: Props) {
  const {
    status,
    children,
    isEmpty,
    isAuthenticated,
    onOpenLogin,
    hasSearchQuery,
    hasMore,
    onLoadMore,
  } = props;

  return (
    <div className="mt-2 flex-1 overflow-y-auto custom-scrollbar pl-1">
      {!isAuthenticated ? (
        <div className="h-full -mt-12 px-6 flex flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
            <LogIn className="size-6" />
          </div>

          <p className="text-zinc-800 text-cs85 font-bold mt-5 mb-1.5">
            برای مشاهده لیست مسافران وارد شوید
          </p>

          <p className="text-zinc-500 text-cs08/6 font-semibold">
            جهت دسترسی به دفترچه مسافران ثبت‌شده خود، لطفاً وارد حساب کاربری شوید.
          </p>

          {onOpenLogin && (
            <button
              type="button"
              onClick={onOpenLogin}
              className="mt-5 rounded-xl bg-cs-red px-5 py-2.5 text-xs font-bold text-white transition hover:opacity-90"
            >
              ورود به حساب کاربری
            </button>
          )}
        </div>
      ) : status === 'pending' ? (
        <div className="flex-center h-full">
          <span className={loader.dots} style={{ scale: '1.2' }} />
        </div>
      ) : status === 'error' ? (
        <div className="h-full -mt-12 flex flex-col items-center justify-center gap-4">
          <VscError color="#444" size={50} />
          <p className="text-zinc-800 text-cs85 font-bold">
            در نمایش اطلاعات مسافران خطایی رخ داده است !
          </p>
        </div>
      ) : isEmpty ? (
        hasSearchQuery ? (
          <div className="py-10 text-center text-xs font-semibold text-zinc-500">
            مسافری با این مشخصات یافت نشد !
          </div>
        ) : (
          <div className="h-full -mt-12 px-6 flex flex-col items-center justify-center">
            <FaRegLightbulb color="#444" size={50} />
            <p className="text-zinc-800 text-cs85 font-bold mt-6 mb-1">
              لیست مسافران شما خالی میباشد !
            </p>

            <p className="text-zinc-500 text-cs08/6 text-center font-semibold">
              برای مدیریت مسافران از صفحه &quot;مسافران من&quot; در پنل کاربری خود اقدام
              نمایید .
            </p>

            <div className="w-full my-5 border-b border-dashed" />

            <Link
              href={'/dashboard/passengers'}
              className="bg-zinc-100 text-zinc-500 text-cs85 font-semibold px-5 py-2 flex-center gap-1.5 border rounded-lg"
            >
              <HiExternalLink color="#888" size={20} />
              مسافران من
            </Link>
          </div>
        )
      ) : (
        <>
          <div className="divide-y divide-zinc-200/80">{children}</div>

          {hasMore && onLoadMore && (
            <div className="flex justify-end pt-4 pb-2">
              <button
                type="button"
                onClick={onLoadMore}
                className="rounded-xl bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
              >
                مشاهده بیشتر لیست
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
