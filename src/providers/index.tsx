'use client';

import { Toaster } from '@/components/ui/toast';
import { ThemeProvider } from './theme-provider';

import { TooltipProvider } from '@/components/ui/tooltip';
import { DirectionProvider } from '@/components/ui/direction';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthModalProvider } from '@/features/auth/model/auth-modal-context';
import { AuthModal } from '@/features/auth/view/auth-modal';
import { DatePickerProvider } from '@/components/common/date-picker';
import { Suspense } from 'react';
import { DestinationProvider } from '@/components/common/destination-search';

// ------------------------------

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <Suspense>
      <DirectionProvider direction="rtl">
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <AuthModalProvider>
                <DatePickerProvider>
                  <DestinationProvider>
                    {children}

                    <Toaster />
                    <AuthModal />
                    {/* <AuthAlert /> */}
                  </DestinationProvider>
                </DatePickerProvider>
              </AuthModalProvider>
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </DirectionProvider>
    </Suspense>
  );
}
