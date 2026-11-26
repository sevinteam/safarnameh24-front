import Link from 'next/link';
import { payment } from '../../helpers/constant';
import { useSearchParams } from 'next/navigation';

type Props = { activeStep: number };

// ------------------------------

export function StepBackButton(props: Props) {
  const { activeStep } = props;

  const { reservationId } = payment;
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get(reservationId);

  const href =
    activeStep === 3
      ? `/payment/complete-passengers-information?${reservationId}=${trackingCode}`
      : '/';

  return (
    <Link
      scroll={false}
      href={href}
      className="rounded-lg bg-zinc-100 px-4 py-3 text-cs08 font-semibold lg:px-5"
    >
      {activeStep === 3
        ? 'ویرایش مشخصات مسافران'
        : 'بازگشت به صفحه اصلی'}
    </Link>
  );
}
