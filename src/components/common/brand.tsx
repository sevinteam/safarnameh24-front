import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { routes } from '@/config/routes';
import { SITE_CONFIG } from '@/config/site';

type Props = {
  className?: string;
  showTitle?: boolean;
  showSubtitle?: boolean;
  imageClassName?: string;
};

// ------------------------------

export default function Brand(props: Props) {
  const { className, showTitle, showSubtitle, imageClassName } = props;

  return (
    <Link
      href={routes.index}
      className={cn('flex w-fit items-center-safe gap-2', className)}
    >
      <Image
        priority
        alt={SITE_CONFIG.name}
        src={SITE_CONFIG.logo.secondary}

        className={cn('h-auto w-14', imageClassName)}
      />

      <div className="text-foreground flex flex-col leading-8 capitalize">
        {showTitle && (
          <h1 className="font-brand text-[1.6rem]">{SITE_CONFIG.name}</h1>
        )}

        {showSubtitle && (
          <h2 className="mt-1.5 text-sm font-semibold">{SITE_CONFIG.slogan}</h2>
        )}
      </div>
    </Link>
  );
}
