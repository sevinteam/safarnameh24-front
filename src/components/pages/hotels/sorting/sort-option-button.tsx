import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Button } from '@/components/ui/button';
import { SortOption, SortValue } from './types';

interface SortOptionButtonProps {
  option: SortOption;
  isActive: boolean;
  onSelect: (value: SortValue) => void;
}

// ------------------------------

export const SortOptionButton = ({
  option,
  isActive,
  onSelect,
}: SortOptionButtonProps) => {
  const { value, label, description, icon: Icon } = option;

  const button = (
    <Button
      size="sm"
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(value)}
      className={'h-9 gap-1.5 rounded-lg px-3'}
      variant={isActive ? 'default' : 'secondary'}
    >
      {Icon && option.value !== 'recommended' && (
        <Icon className="size-4 shrink-0" />
      )}
      <span>{label}</span>
    </Button>
  );

  if (!description) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="bottom">{description}</TooltipContent>
    </Tooltip>
  );
};
