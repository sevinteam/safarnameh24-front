import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ------------------------------

export default function SubmitButton() {
  return (
    <Button className={'lg:h-12 lg:w-40'}>
      <span className="font-bold">جستجو</span>
      <ArrowLeft className="size-4" />
    </Button>
  );
}
