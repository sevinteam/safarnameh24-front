import { Button } from '@/components/ui/button';
import { ClipboardCheck, Headphones } from 'lucide-react';

// ------------------------------

export default function CombineActions() {
  return (
    <div className="hidden sm:block">
      <Button variant={'ghost'} className={'font-semibold'}>
        <ClipboardCheck />
        <span>پیگیری رزرو</span>
      </Button>

      <Button variant={'ghost'} className={'font-semibold'}>
        <Headphones />
        <span>پشتیبانی</span>
      </Button>
    </div>
  );
}
