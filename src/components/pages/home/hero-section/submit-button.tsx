import { cn } from '@/lib/utils';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  className?: string;
  showIcon?: boolean;

  children?: React.ReactNode;
};

// ------------------------------

export default function SubmitButton(props: Props) {
  const { className, showIcon = true, children } = props;

  return (
    <Button className={cn('lg:h-12 lg:w-40', className)}>
      {children ? (
        children
      ) : (
        <>
          <span className="font-bold">جستجو</span>
          {showIcon && <ArrowLeft className="size-4" />}
        </>
      )}
    </Button>
  );
}
