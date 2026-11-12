import React from 'react';
import { SearchX } from 'lucide-react';

interface DestinationEmptyStateProps {
  message?: string;
}

export const DestinationEmptyState: React.FC<DestinationEmptyStateProps> = ({
  message = 'موردی با این مشخصات پیدا نشد !',
}) => {
  return (
    <div className="text-muted-foreground flex min-h-60 flex-col items-center justify-center gap-2 p-4">
      <SearchX className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full p-3.5" />

      <p className="text-foreground mt-3 text-sm font-medium">{message}</p>
      <span className="text-muted-foreground text-sm">
        نام شهر یا هتل دیگری را امتحان کنید .
      </span>
    </div>
  );
};
