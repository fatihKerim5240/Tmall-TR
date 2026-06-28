"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, ChevronRight, Star, ShoppingCart, Heart } from "lucide-react";
import { FLASH_PRODUCTS } from "@/lib/data";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

/* ─── Countdown hook – endTime state'te tutulur, sıfırlandığında yenilenir ─── */
function useCountdown() {
  const DURATION = 6 * 3600 * 1000; // 6 saat
  const [endTime, setEndTime] = useState<number>(() => Date.now() + DURATION);
  const [remaining, setRemaining] = useState<number>(DURATION);

  useEffect(() => {
    const tick = () => {
      const r = endTime - Date.now();
      if (r <= 0) {
        const next = Date.now() + DURATION;
        setEndTime(next);
        setRemaining(DURATION);
      } else {
        setRemaining(r);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { h, m, s };
}

/* ─── Animasyonlu zaman birimi ─── */
function TimeUnit({ value, label }: { value: number; label: string }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlip(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-10 h-10 overflow-hidden rounded bg-[#1A1A1A]">
        <span
          className={`absolute inset-0 flex items-center justify-center text-white text-xl font-black transition-all duration-300 ${
            flip ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {String(value).padStart(2, "0")}
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center text-white text-xl font-black transition-all duration-300 ${
            flip ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          {String(prev).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] text-gray-400 mt-0.5 font-semibold tracking-wide">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className={`text-[#FF0036] font-black text-xl mb-3 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-30"
      }`}
    >
      :
    </span>
  );
}

/* ─── Flash Kart ─── */
function FlashCard({ product: p }: { product: (typeof FLASH_PRODUCTS)[0] }) {
  const [mounted, setMounted] = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { items: favItems, toggle } = useFavoritesStore();

  useEffect(() => setMounted(true), []);

  const isFaved = mounted && favItems.some((f) => f.id === p.id);

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // p is FLASH_PRODUCTS item – cast to Product for addItem
    addItem(p as Parameters<typeof addItem>[0]);
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1800);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(p as Parameters<typeof toggle>[0]);
  };

  return (
    <Link
      href={`/urun/${p.id}`}
      className="flex-shrink-0 w-[185px] p-3 hover:bg-red-50/50 transition-colors group relative"
    >
      {/* Badge */}
      {p.badge && (
        <span className="absolute top-3 left-3 z-10 bg-[#FF0036] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">
          {p.badge}
        </span>
      )}
      {p.discount && (
        <span className="absolute top-3 right-3 z-10 bg-[#FF6600] text-white text-xs font-black px-1.5 py-0.5 rounded-sm">
          %{p.discount}
        </span>
      )}

      {/* Görsel */}
      <div className="relative aspect-square mb-2 overflow-hidden rounded bg-gray-50">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover aksiyonları */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFav}
            className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-semibold transition-all ${
              isFaved
                ? "bg-[#FF0036] text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-[#FF0036]"
            }`}
          >
            <Heart size={12} className={isFaved ? "fill-white" : ""} />
          </button>
          <button
            onClick={handleCart}
            className={`flex-1 h-7 flex items-center justify-center rounded text-xs font-semibold transition-all ${
              addedCart
                ? "bg-green-500 text-white"
                : "bg-[#FF0036] text-white hover:bg-[#CC0029]"
            }`}
          >
            <ShoppingCart size={12} />
          </button>
        </div>
      </div>

      {/* Fiyat */}
      <div className="flex items-baseline gap-1.5 mb-0.5">
        <span className="text-[#FF0036] font-black text-lg">
          {p.price.toLocaleString("tr-TR")}₺
        </span>
      </div>
      {p.originalPrice && (
        <span className="text-gray-400 text-xs line-through">
          {p.originalPrice.toLocaleString("tr-TR")}₺
        </span>
      )}

      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{p.name}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-0.5">
          <Star size={10} className="fill-[#FAAD14] text-[#FAAD14]" />
          <span className="text-xs text-gray-500">{p.rating}</span>
        </div>
        <span className="text-[10px] text-gray-400">
          {p.sold?.toLocaleString("tr-TR")} satış
        </span>
      </div>

      {/* Stok çubuğu */}
      <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF6600] to-[#FF0036] rounded-full transition-all"
          style={{ width: `${Math.min(85, 30 + (p.sold ?? 50) % 55)}%` }}
        />
      </div>
      <p className="text-[9px] text-gray-400 mt-0.5 text-right">Az kaldı!</p>
    </Link>
  );
}

/* ─── Ana Bileşen ─── */
export function FlashSaleSection() {
  const { h, m, s } = useCountdown();

  return (
    <section className="max-w-[1200px] mx-auto mb-4">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Başlık */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#FF0036] text-white px-3 py-1.5 rounded font-black text-sm animate-pulse-subtle">
              <Zap size={14} className="fill-white" />
              FLASH İNDİRİM
            </div>
            <div className="flex items-center gap-1.5">
              <TimeUnit value={h} label="SAAT" />
              <Colon />
              <TimeUnit value={m} label="DAK" />
              <Colon />
              <TimeUnit value={s} label="SAN" />
            </div>
          </div>
          <Link
            href="/flash"
            className="flex items-center gap-1 text-sm text-[#FF0036] font-medium hover:underline"
          >
            Tümünü Gör <ChevronRight size={16} />
          </Link>
        </div>

        {/* Ürün kaydırma */}
        <div className="flex overflow-x-auto no-scrollbar gap-0 divide-x divide-gray-100">
          {FLASH_PRODUCTS.map((p) => (
            <FlashCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
