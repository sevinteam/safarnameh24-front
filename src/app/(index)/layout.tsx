import { FloatingActions } from '@/components/layout/floating-actions/floating-actions';
import { Footer } from '@/components/layout/footer';
import { Header, SmartHeader } from '@/components/layout/header';

// ------------------------------

export default function IndexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* <Header /> */}
      <SmartHeader />

      <main className="relative mx-auto mt-8 mb-24 w-full max-w-7xl px-4">
        {children}
      </main>

      <FloatingActions />
      <Footer />
    </div>
  );
}
