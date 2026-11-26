import {
  PaymentInvoice,
  CapacityStatusCard,
  CheckReservationInfo,
} from '@/components/landing/modules/payment/organisms';

// ------------------------------

export default function CheckReservationInformation() {
  return (
    <>
      {/* === Small-Screen */}
      <div className="space-y-6 lg:hidden">
        <CheckReservationInfo />
        <CapacityStatusCard />
        <PaymentInvoice />
      </div>

      {/* === Large-Screen */}
      <div className="hidden grid-cols-[1fr_2.8fr] items-start gap-x-6 lg:grid">
        {/* --- Right-Column */}
        <div className="sticky top-[6.4rem] space-y-6">
          <CheckReservationInfo />
          <PaymentInvoice />
        </div>

        {/* --- Left-Column */}
        <div className="space-y-6">
          <CapacityStatusCard />
        </div>
      </div>
    </>
  );
}
