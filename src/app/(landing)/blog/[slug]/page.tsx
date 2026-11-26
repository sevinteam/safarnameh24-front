import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `مقاله ${slug} | وبلاگ ${SITE_NAME}`,
  };
}

export default async function BlogDetailPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-center text-zinc-400">
      {/* منتظر دستور طراحی صفحه داخلی وبلاگ از سمت کاربر */}
    </main>
  );
}
