import { Person } from '../../../helpers/type';

type Props = {
  idx: number;
  passenger: Person;
  handleCloseSheet: () => void;
  fillPassenger: (idx: number, passengerData: Person) => void;
};

// ------------------------------

function formatPhoneDisplay(phone?: string) {
  if (!phone) return '-';
  const clean = phone.trim();
  if (/^09\d{9}$/.test(clean)) {
    return `98 - ${clean.slice(1)}`;
  }
  if (/^9\d{9}$/.test(clean)) {
    return `98 - ${clean}`;
  }
  return clean;
}

export function NoteBookItem(props: Props) {
  const { idx, passenger, fillPassenger, handleCloseSheet } = props;

  function choosePassenger() {
    fillPassenger(idx, {
      first_name: passenger.first_name || '',
      last_name: passenger.last_name || '',
      phone_number: passenger.phone_number || '',
      national_code: passenger.national_code || '',
    });
    handleCloseSheet();
  }

  return (
    <div className="py-4 first:pt-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-extrabold text-zinc-900">
          {passenger.first_name} {passenger.last_name}
        </span>

        <button
          type="button"
          onClick={choosePassenger}
          className="rounded-lg bg-zinc-100 px-4 py-1.5 text-[11px] font-semibold text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-800"
        >
          انتخاب
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-zinc-800">شماره همراه :</span>
        <span dir="ltr" className="font-medium text-zinc-500">
          {formatPhoneDisplay(passenger.phone_number)}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-zinc-800">
          کد ملی، شماره پاسپورت :
        </span>
        <span dir="ltr" className="font-medium text-zinc-500">
          {passenger.national_code || '-'}
        </span>
      </div>
    </div>
  );
}
