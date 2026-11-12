import React from 'react';
import { useAuthModal } from '../model/auth-modal-context';
import { useFormContext } from 'react-hook-form';
import { AuthFormValues } from '../model/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Info, Loader2 } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import Link from 'next/link';
import { routes } from '@/config/routes';

export const AuthFooter: React.FC = () => {
  const { step, isSubmitting } = useAuthModal();
  const {
    formState: { isValid },
  } = useFormContext<AuthFormValues>();

  return (
    <div className="mt-auto flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Info className="text-muted-foreground size-4 shrink-0" />

        <p className="text-muted-foreground text-xs/5 font-medium">
          ورود و استفاده از{' '}
          <span className="text-primary">{SITE_CONFIG.name}</span> به معنای
          پذیرش{' '}
          <Link href={routes.rules} className="underline">
            قوانین و مقررات
          </Link>{' '}
          این سرویس می باشد.
        </p>
      </div>

      {/* Dynamic Master Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <span>
            <span className="dots inline-block scale-70" />
          </span>
        ) : step === 'phone' ? (
          'دریافت کد تایید'
        ) : (
          'تایید و ورود'
        )}
      </Button>
    </div>
  );
};
