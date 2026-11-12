import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';

import { SmartHeader } from '@/features/smart-header/header-wrapper';

// ------------------------------

export default function IndexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* <Header /> */}
      <SmartHeader />

      <main className="relative mx-auto mt-6 mb-24 w-full max-w-7xl px-4">
        {children}
      </main>

      <Footer />
    </div>
  );
}
