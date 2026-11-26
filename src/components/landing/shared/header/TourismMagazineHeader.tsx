'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Trash2, X } from 'lucide-react';
import logo from '@/assets';
import { generalInstance } from '@/utils/services';
import { useScrollPosition } from '@/hooks';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';

type CategoryItem = {
  id: string | number;
  title: string;
  slug?: string;
};

type RecentSearchItem = {
  id: number;
  query: string;
  category: string;
};

const RECENT_SEARCHES_STORAGE_KEY = 'zarvan_blog_recent_searches';

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'danestani', title: 'دانستنی سفر', slug: 'danestani' },
  { id: 'mag', title: 'مجله گردشگری', slug: 'mag' },
  { id: 'jahangardi', title: 'جهانگردی', slug: 'jahangardi' },
  { id: 'irangardi', title: 'ایران گردی', slug: 'irangardi' },
];

function TourismMagazineHeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const scrollPosition = useScrollPosition();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const persistRecentSearches = (items: RecentSearchItem[]) => {
    setRecentSearches(items);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write errors
    }
  };

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

  const executeSearch = (queryText: string) => {
    const trimmed = queryText.trim();
    if (trimmed) {
      const activeCatTitle =
        categories.find((c) => (c.slug || String(c.id)) === activeCategory)
          ?.title || 'مجله گردشگری';
      const updated = [
        {
          id: Date.now(),
          query: trimmed,
          category: `دسته ${activeCatTitle}`,
        },
        ...recentSearches.filter((item) => item.query !== trimmed),
      ].slice(0, 8);
      persistRecentSearches(updated);
      router.push(`/blog?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/blog');
    }
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleDeleteRecentSearch = (id: number) => {
    const updated = recentSearches.filter((item) => item.id !== id);
    persistRecentSearches(updated);
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
            href="/"
            className="flex items-center gap-3.5 cursor-pointer"
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
              <span className="text-cs085 font-bold text-zinc-800">
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

          {/* Left: Search Button & Hotel Reservation Button */}
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center rounded-[9px] bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200/80 active:scale-95"
              >
                <span>جستجو</span>
              </button>
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
          <Link href="/" className="flex items-center gap-2.5">
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
              type="button"
              onClick={() => setIsSearchOpen(true)}
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

      {/* Search Drawer (Sheet) */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent
          side="right"
          dir="rtl"
          className="w-[88vw] sm:w-[400px] sm:max-w-[400px] border-l-0 bg-white p-6 shadow-2xl data-[state=closed]:duration-300 data-[state=open]:duration-300"
        >
          <SheetDescription className="sr-only">
            جستجو در مقالات مجله گردشگری زروان تریپ
          </SheetDescription>

          {/* Drawer Header: Zarvan Logo + Title on Right, Close Icon on Left */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-center size-12 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={logo}
                  alt="لوگو زروان تریپ"
                  width={96}
                  height={96}
                  className="aspect-auto w-full object-contain"
                />
              </div>
              <SheetTitle className="text-sm font-extrabold text-zinc-900">
                مجله گردشگری زروان تریپ
              </SheetTitle>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="بستن"
              className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="mt-7">
            <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 shadow-[0_6px_24px_rgba(0,0,0,0.04)]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="دنبال چه مقاله ای میگردی..."
                autoFocus
                className="w-full bg-transparent text-xs font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            </div>
          </form>

          {/* Recent Searches */}
          <div className="mt-7">
            <h3 className="text-xs font-extrabold text-zinc-900">
              جستجو های اخیر
            </h3>
            <div className="my-3.5 border-t border-dashed border-zinc-200" />

            {recentSearches.length === 0 ? (
              <p className="py-6 text-center text-xs font-medium text-zinc-400">
                جستجوی اخیری ثبت نشده است
              </p>
            ) : (
              <div className="space-y-4">
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.query);
                        executeSearch(item.query);
                      }}
                      className="flex flex-1 flex-col items-start text-right group"
                    >
                      <span className="text-xs font-bold text-zinc-800 group-hover:text-zinc-950">
                        {item.query}
                      </span>
                      <span className="mt-0.5 text-[11px] font-medium text-zinc-400">
                        {item.category}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRecentSearch(item.id)}
                      aria-label="حذف جستجو"
                      className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cs-red/10 text-[#f30f26] transition hover:bg-cs-red/20"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
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
