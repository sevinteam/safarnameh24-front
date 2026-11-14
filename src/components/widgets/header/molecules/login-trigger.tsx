'use client';

import { cn } from 'cn';

import { LogIn, MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useAuthModal } from '@/features/auth/model/auth-modal-context';

type Props = {
  className?: string;
  variant?: 'normal' | 'full-width';
};

// ---------------------------------

export function LoginTrigger(props: Props) {
  const { variant = 'normal', className } = props;

  const { openAuthModal } = useAuthModal();

  return (
    <Button onClick={openAuthModal} className={cn('sm:px-5', className)}>
      <LogIn />

      {variant === 'normal' ? (
        <span>ورود</span>
      ) : (
        <>
          <span>ورود به حساب کاربری</span>
          <MoveLeft className="mr-auto" />
        </>
      )}
    </Button>
  );
}
