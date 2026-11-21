import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/config/site';

// ------------------------------

export function SocialMedia() {
  return (
    <div className="space-y-4">
      <span className="inline-block text-sm font-semibold">
        شبکه های اجتماعی :
      </span>

      <div className="flex flex-wrap gap-4">
        {SITE_CONFIG.social_media?.map(
          (item) =>
            item.href && (
              <Tooltip key={item.type}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="link"
                      nativeButton={false}
                      className="size-10 rounded-xl p-0"
                      render={
                        <Link target="_blank" href={item.href}>
                          {item.image && (
                            <Image
                              alt={item.image.alt}
                              src={item.image.src}
                              className="size-full"
                            />
                          )}
                        </Link>
                      }
                    />
                  }
                />

                <TooltipContent className="capitalize">
                  {item.label.fa}
                </TooltipContent>
              </Tooltip>
            ),
        )}
      </div>
    </div>
  );
}
