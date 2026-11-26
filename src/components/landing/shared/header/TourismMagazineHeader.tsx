'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import logo from '@/assets';
import { generalInstance } from '@/utils/services';
import { useScrollPosition } from '@/hooks';

type CategoryItem = {
  id: string | number;
  title: string;
  slug?: string;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'danestani', title: 'دانستنی سفر', slug: 'danestani' },
  { id: 'mag', title: 'مجله گردشگری', slug: 'mag' },
  { id: 'jahangardi', title: 'جهانگردی', slug: 'jahangardi' },
  { id: 'irangardi', title: 'ایران گردی', slug: 'irangardi' },
];

function TourismMagazineHeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const scrollPosition = useScrollPosition();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch dynamic categories from backend if available
  const { data: rawCategories } = useQuery<any>({
    queryKey: ['tourism-magazine-categories'],
    queryFn: async () => {
      try {
        const response = await generalInstance.get('/config/tourism-categories/');
        return response.data;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 10,
  });

  const categories: CategoryItem[] =
    Array.isArray(rawCategories?.data) && rawCategories.data.length > 0
      ? rawCategories.data
      : Array.isArray(rawCategories) && rawCategories.length > 0
        ? rawCategories
        : DEFAULT_CATEGORIES;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/blog');
    }
    setIsSearchOpen(false);
  };

  const isScrolled = scrollPosition > 10;

  return (
    <>
      {/* Background overlay spacer */}
      <div
        className={`fixed inset-x-0 top-0 z-20 hidden h-[5rem] border-b bg-white/95 backdrop-blur-md transition-all duration-300 lg:block ${
          isScrolled
            ? 'border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
            : 'border-zinc-100'
        }`}
      />

      {/* Main Desktop Header */}
      <header className="sticky top-0 z-30 mx-auto hidden h-[5rem] max-w-screen-template lg:flex items-center">
        <div className="flex w-full items-center justify-between mx-5 font-bold">
          {/* Right: Red Logo + Magazine Brand Name */}
          <Link
            href="/blog"
            className="flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="flex-center size-14 overflow-hidden rounded-xl">
              <Image
                src={logo}
                alt="لوگو زروان تریپ"
                width={100}
                height={100}
                className="aspect-auto w-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-cs085 font-bold text-zinc-800 group-hover:text-red-600 transition-colors">
                مجله گردشگری زروان تریپ
              </span>
            </div>
          </Link>

          {/* Middle: Navigation Items ('صفحه اصلی' default + Categories) */}
          <nav className="flex items-center gap-6 xl:gap-8">
            {/* صفحه اصلی (Default) */}
            <Link
              href="/blog"
              className={`relative py-2 text-sm font-extrabold transition-colors duration-200 ${
                !activeCategory
                  ? 'text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <span>صفحه اصلی</span>
              {!activeCategory && (
                <span className="absolute -bottom-1.5 inset-x-0 mx-auto h-0.5 w-6 rounded-full bg-red-600 transition-all" />
              )}
            </Link>

            {/* Dynamic categories from backend with fallbacks */}
            {categories.map((cat, idx) => {
              const catSlug = cat.slug || String(cat.id);
              const isActive = activeCategory === catSlug;
              return (
                <Link
                  key={idx}
                  href={`/blog?category=${encodeURIComponent(catSlug)}`}
                  className={`relative py-2 text-sm font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <span>{cat.title}</span>
                  {isActive && (
                    <span className="absolute -bottom-1.5 inset-x-0 mx-auto h-0.5 w-6 rounded-full bg-red-600 transition-all" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Left: Search Box & Hotel Reservation Button */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <div className="relative">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center rounded-[9px] bg-zinc-100 px-3 py-1.5 border border-zinc-200 transition-all"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو در مقالات..."
                    autoFocus
                    className="w-36 bg-transparent text-xs font-bold text-zinc-800 outline-none placeholder:text-zinc-400 xl:w-48"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center rounded-[9px] bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200/80 active:scale-95"
                >
                  <span>جستجو</span>
                </button>
              )}
            </div>

            {/* Hotel Reservation Button */}
            <Link
              href="/hotel"
              className="flex items-center justify-center rounded-[9px] bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-800 transition hover:bg-zinc-200/80 active:scale-95"
            >
              <span>رزرو هتل</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 mx-4 mt-2 flex flex-col gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-zinc-100 lg:hidden">
        <div className="flex items-center justify-between">
          {/* Logo & Magazine title */}
          <Link href="/blog" className="flex items-center gap-2.5">
            <div className="flex-center size-11 overflow-hidden rounded-lg">
              <Image
                src={logo}
                alt="لوگو زروان تریپ"
                width={80}
                height={80}
                className="aspect-auto w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-800">
                مجله گردشگری زروان تریپ
              </span>
            </div>
          </Link>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex h-9 items-center justify-center rounded-[9px] bg-zinc-100 px-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
              aria-label="جستجو"
            >
              <span>جستجو</span>
            </button>
            <Link
              href="/hotel"
              className="flex h-9 items-center justify-center rounded-[9px] bg-zinc-100 px-3 text-xs font-bold text-zinc-800 hover:bg-zinc-200"
            >
              <span>رزرو هتل</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search input when toggled */}
        {isSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center rounded-[9px] bg-zinc-50 px-3 py-2 border border-zinc-200"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مقالات مجله گردشگری..."
              className="flex-1 bg-transparent text-xs font-bold text-zinc-800 outline-none placeholder:text-zinc-400"
            />
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-zinc-400"
            >
              <X className="size-3.5" />
            </button>
          </form>
        )}

        {/* Mobile Horizontal Category Bar */}
        <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none border-t border-zinc-100 pt-2 text-xs font-bold">
          <Link
            href="/blog"
            className={`whitespace-nowrap pb-1 border-b-2 transition-colors ${
              !activeCategory
                ? 'border-red-600 text-zinc-900 font-extrabold'
                : 'border-transparent text-zinc-500'
            }`}
          >
            صفحه اصلی
          </Link>

          {categories.map((cat, idx) => {
            const catSlug = cat.slug || String(cat.id);
            const isActive = activeCategory === catSlug;
            return (
              <Link
                key={idx}
                href={`/blog?category=${encodeURIComponent(catSlug)}`}
                className={`whitespace-nowrap pb-1 border-b-2 transition-colors ${
                  isActive
                    ? 'border-red-600 text-zinc-900 font-extrabold'
                    : 'border-transparent text-zinc-500'
                }`}
              >
                {cat.title}
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}

export default function TourismMagazineHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-30 mx-auto hidden h-[5rem] max-w-screen-template lg:flex items-center">
          <div className="flex w-full items-center justify-between mx-5 font-bold">
            <div className="h-10 w-44 rounded-xl bg-zinc-100 animate-pulse" />
            <div className="h-6 w-72 rounded-lg bg-zinc-100 animate-pulse" />
            <div className="h-10 w-40 rounded-xl bg-zinc-100 animate-pulse" />
          </div>
        </header>
      }
    >
      <TourismMagazineHeaderContent />
    </Suspense>
  );
}
