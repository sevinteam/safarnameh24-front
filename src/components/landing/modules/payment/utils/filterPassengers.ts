import { Person } from '../helpers/type';

type Props = {
  passengers: Person[];
  searchedValue: string;
};

// ------------------------------

export function filterPassengers(props: Props) {
  const { passengers, searchedValue } = props;
  const query = searchedValue.toLowerCase().trim();

  if (!query) return passengers;

  return passengers.filter((passenger) => {
    const firstName = (passenger.first_name || '').toLowerCase().trim();
    const lastName = (passenger.last_name || '').toLowerCase().trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const nationalCode = (passenger.national_code || '').toLowerCase().trim();
    const phoneNumber = (passenger.phone_number || '').toLowerCase().trim();

    return (
      firstName.includes(query) ||
      lastName.includes(query) ||
      fullName.includes(query) ||
      nationalCode.includes(query) ||
      phoneNumber.includes(query)
    );
  });
}
