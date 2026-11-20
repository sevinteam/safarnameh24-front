import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { ViewMode, ViewModeOption } from './types';

type ViewModeButtonProps = {
  option: ViewModeOption;
  isActive: boolean;
  onSelect: (value: ViewMode) => void;
};

// ------------------------------

export const ViewModeButton = ({
  option,
  isActive,
  onSelect,
}: ViewModeButtonProps) => {
  const { value, label, icon: Icon } = option;

  const button = (
    <Button
      type="button"
      size={'icon-sm'}
      aria-label={label}
      aria-pressed={isActive}
      onClick={() => onSelect(value)}
      variant={isActive ? 'default' : 'ghost'}
    >
      <Icon className="size-4 shrink-0" />
    </Button>
  );

  // Base UI uses `render` instead of Radix's `asChild`
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
};
