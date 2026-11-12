import { Footer } from '@/components/widgets/footer';
import { Header, SmartHeader } from '@/components/widgets/header';

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
