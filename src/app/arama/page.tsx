"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { ALL_PRODUCTS } from "@/lib/products";
import { Product } from "@/types";

/* ─────────────────────────────────────────────────────────────
   Arama algoritması
───────────────────────────────────────────────────────────── */
function searchProducts(q: string): Product[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.brand?.toLowerCase().includes(lower) ||
      p.category?.toLowerCase().includes(lower) ||
      p.badge?.toLowerCase().includes(lower) ||
      p.shop?.toLowerCase().includes(lower)
  );
}

/* ─────────────────────────────────────────────────────────────
   Sıralama seçenekleri
───────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "relevance",  label: "En İlgili" },
  { value: "price_asc",  label: "Fiyat: Düşükten Yükseğe" },
  { value: "price_desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "rating",     label: "En Yüksek Puan" },
  { value: "sold",       label: "En Çok Satan" },
];

/* ─────────────────────────────────────────────────────────────
   Sonuç yok — boş durum
───────────────────────────────────────────────────────────── */
function EmptyState({ query }: { query: string }) {
  const POPULAR = ["iPhone", "Nike", "Samsung", "Zara", "Dyson", "IKEA"];
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center px-4">
      {/* İllüstrasyon */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center">
          <Search size={46} className="text-gray-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#FF0036]/10 flex items-center justify-center">
          <X size={16} className="text-[#FF0036]" />
        </div>
      </div>

      <div className="max-w-md">
        <p className="text-xl font-bold text-gray-800 mb-2">
          &quot;{query}&quot; için sonuç bulunamadı
        </p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Lütfen farklı kelimelerle tekrar deneyin. Yazım hatalarını kontrol
          edin veya daha genel terimler kullanmayı deneyin.
        </p>
      </div>

      {/* Öneriler */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Popüler Aramalar
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR.map((term) => (
            <Link
              key={term}
              href={`/arama?q=${encodeURIComponent(term)}`}
              className="px-4 py-2 bg-white border border-gray-200 hover:border-[#FF0036] hover:text-[#FF0036] text-gray-600 text-sm rounded-full shadow-sm transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/"
        className="px-7 py-3 bg-[#FF0036] text-white rounded-xl text-sm font-bold hover:bg-[#CC0029] transition-colors shadow-md"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Yükleniyor iskeleti
───────────────────────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ana içerik (useSearchParams gerektiriyor)
───────────────────────────────────────────────────────────── */
function SearchContent() {
  const params = useSearchParams();
  const query  = params.get("q") ?? "";
  const [sort, setSort] = useState("relevance");

  const raw = useMemo(() => searchProducts(query), [query]);

  const results = useMemo(() => {
    switch (sort) {
      case "price_asc":  return [...raw].sort((a, b) => a.price - b.price);
      case "price_desc": return [...raw].sort((a, b) => b.price - a.price);
      case "rating":     return [...raw].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "sold":       return [...raw].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
      default:           return raw;
    }
  }, [raw, sort]);

  /* Boş query */
  if (!query) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Search size={40} className="text-gray-300" />
        <p className="text-gray-500 text-sm">Arama yapmak için bir şeyler yazın.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {/* Sayfa başlığı + sıralama */}
      <div className="flex items-start sm:items-center justify-between mb-5 flex-col sm:flex-row gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2 flex-wrap">
            <Search size={18} className="text-[#FF0036] flex-shrink-0" />
            <span>&quot;{query}&quot; için sonuçlar</span>
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 ml-6 sm:ml-7">
            {results.length > 0
              ? `${results.length} ürün bulundu`
              : "Ürün bulunamadı"}
          </p>
        </div>

        {results.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500">Sırala:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-[#FF0036] appearance-none bg-white cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sonuçlar veya boş durum */}
      {results.length === 0 ? (
        <EmptyState query={query} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sayfa export'u — Suspense ile useSearchParams sarılı
───────────────────────────────────────────────────────────── */
export default function SearchPage() {
  return (
    <PageWrapper>
      <Suspense
        fallback={
          <div className="max-w-[1200px] mx-auto px-4 py-6">
            <div className="h-6 w-56 bg-gray-100 rounded mb-5 animate-pulse" />
            <SkeletonGrid />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </PageWrapper>
  );
}
