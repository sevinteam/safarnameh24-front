import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

import { FloatingActions } from '@/components/layout/floating-actions';

// ------------------------------

export default function MainGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="relative flex-1">{children}</main>

      <FloatingActions />
      <Footer />
    </div>
  );
}
