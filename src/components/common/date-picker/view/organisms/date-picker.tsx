'use client';

import CalendarSheet from './calendar-sheet';
import CalendarDialog from './calendar-dialog';

import { useMediaQuery } from '@/hooks/use-media-query';

type Props = {};

// ------------------------------

export function DatePicker(props: Props) {
  const {} = props;

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return <>{!isDesktop ? <CalendarSheet /> : <CalendarDialog />}</>;
}
