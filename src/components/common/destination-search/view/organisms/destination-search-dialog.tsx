import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

import { SearchInput } from '../molecules/search-input';
import { DestinationList } from '../molecules/destination-list';

import { useDestination } from '../../model/destination-search-context';

type Props = {};

// ------------------------------

export default function DestinationSearchDialog(props: Props) {
  const {} = props;

  const { isOpen, setIsOpen } = useDestination();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className={'h-auto gap-0 overflow-hidden rounded-3xl p-0'}
      >
        <DialogHeader className="p-6">
          <DialogTitle className={'hidden'}></DialogTitle>
          <DialogDescription className={'hidden'}></DialogDescription>

          <SearchInput />
        </DialogHeader>

        <DestinationList />
      </DialogContent>
    </Dialog>
  );
}
