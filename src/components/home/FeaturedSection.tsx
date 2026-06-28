"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Loader2 } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/products";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

const INITIAL_COUNT = 20;
const LOAD_MORE = 8;

/* Ürünleri deterministik sırayla karıştır (seed bazlı) */
const SHUFFLED = [...ALL_PRODUCTS].sort((a, b) => {
  const hashA = a.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const hashB = b.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return (hashA * 7919) % 97 - (hashB * 7919) % 97;
});

/* ─── Ürün Kartı ─── */
function FeaturedCard({ product: p }: { product: (typeof ALL_PRODUCTS)[0] }) {
  const [mounted, setMounted] = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { items: favItems, toggle } = useFavoritesStore();

  useEffect(() => setMounted(true), []);
  const isFaved = mounted && favItems.some((f) => f.id === p.id);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(p);
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1800);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(p);
  };

  return (
    <Link
      href={`/urun/${p.id}`}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:border-red-100 transition-all flex flex-col"
    >
      {/* Görsel */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {p.discount && (
          <span className="absolute top-2 left-2 bg-[#FF0036] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
            %{p.discount}
          </span>
        )}
        {p.badge && (
          <span className="absolute top-2 right-2 bg-[#FF6600] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
            {p.badge}
          </span>
        )}

        {/* Hover aksiyon çubuğu */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex gap-1 p-2 bg-gradient-to-t from-black/30 to-transparent">
          <button
            onClick={handleFav}
            title={isFaved ? "Favorilerden çıkar" : "Favorilere ekle"}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isFaved
                ? "bg-[#FF0036] text-white shadow"
                : "bg-white text-gray-500 hover:text-[#FF0036] shadow"
            }`}
          >
            <Heart size={13} className={isFaved ? "fill-white" : ""} />
          </button>
          <button
            onClick={handleCart}
            className={`flex-1 h-8 rounded-lg flex items-center justify-center gap-1 text-xs font-bold transition-all shadow ${
              addedCart ? "bg-green-500 text-white" : "bg-[#FF0036] text-white hover:bg-[#CC0029]"
            }`}
          >
            <ShoppingCart size={12} />
            {addedCart ? "Eklendi!" : "Sepete Ekle"}
          </button>
        </div>
      </div>

      {/* Bilgi */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm text-gray-700 line-clamp-2 leading-snug mb-2 flex-1">{p.name}</p>

        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[#FF0036] font-black">
            {p.price.toLocaleString("tr-TR")}₺
          </span>
          {p.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              {p.originalPrice.toLocaleString("tr-TR")}₺
            </span>
          )}
        </div>

        {p.rating !== undefined && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={9}
                  className={
                    i < Math.round(p.rating!)
                      ? "fill-[#FAAD14] text-[#FAAD14]"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">
              ({p.sold?.toLocaleString("tr-TR")})
            </span>
          </div>
        )}
        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{p.shop}</p>
      </div>
    </Link>
  );
}

/* ─── Ana Bileşen – Infinite Scroll ─── */
export function FeaturedSection() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const total = SHUFFLED.length;

  const loadMore = useCallback(() => {
    if (loading || visibleCount >= total) return;
    setLoading(true);
    // küçük gecikme – gerçek API hissi verir
    setTimeout(() => {
      setVisibleCount((c) => Math.min(c + LOAD_MORE, total));
      setLoading(false);
    }, 600);
  }, [loading, visibleCount, total]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const visible = SHUFFLED.slice(0, visibleCount);

  return (
    <section className="max-w-[1200px] mx-auto mb-6 px-4">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Başlık */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
            <h2 className="font-black text-gray-800 text-lg">Sizin İçin Seçtiklerimiz</h2>
            <span className="text-xs text-gray-400 font-normal">
              {visibleCount} / {total} ürün
            </span>
          </div>
          <span className="text-xs text-gray-400">Aşağı kaydır, daha fazlasını gör ↓</span>
        </div>

        {/* Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {visible.map((p) => (
            <FeaturedCard key={p.id} product={p} />
          ))}
        </div>

        {/* Sentinel + Loader */}
        <div ref={sentinelRef} className="flex justify-center py-6">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={18} className="animate-spin text-[#FF0036]" />
              Yükleniyor...
            </div>
          )}
          {!loading && visibleCount >= total && (
            <p className="text-sm text-gray-400">Tüm ürünler gösteriliyor ✓</p>
          )}
        </div>
      </div>
    </section>
  );
}
