"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Zap, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { FLASH_PRODUCTS } from "@/lib/data";

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(targetMs - Date.now());
  useEffect(() => {
    const id = setInterval(() => setRemaining(targetMs - Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const total = Math.max(0, remaining);
  const h = Math.floor(total / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return { h, m, s };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-[#1A1A1A] text-white text-xl font-black w-10 h-10 flex items-center justify-center rounded">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}

function Colon() {
  return <span className="text-[#FF0036] font-black text-xl mb-3">:</span>;
}

export function FlashSaleSection() {
  const endTime = Date.now() + 4 * 3600000 + 23 * 60000 + 41000;
  const { h, m, s } = useCountdown(endTime);

  return (
    <section className="max-w-[1200px] mx-auto mb-4">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#FF0036] text-white px-3 py-1.5 rounded font-black text-sm">
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
          <a
            href="/flash"
            className="flex items-center gap-1 text-sm text-[#FF0036] font-medium hover:underline"
          >
            Tümünü Gör <ChevronRight size={16} />
          </a>
        </div>

        {/* Ürünler */}
        <div className="flex overflow-x-auto no-scrollbar gap-0 divide-x divide-gray-100">
          {FLASH_PRODUCTS.map((p) => (
            <FlashCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlashCard({ product: p }: { product: (typeof FLASH_PRODUCTS)[0] }) {
  const [inCart, setInCart] = useState(false);

  return (
    <a
      href={`/urun/${p.id}`}
      className="flex-shrink-0 w-[185px] p-3 hover:bg-red-50/50 transition-colors group relative"
    >
      {/* Badge */}
      {p.badge && (
        <span className="absolute top-3 left-3 z-10 bg-[#FF0036] text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">
          {p.badge}
        </span>
      )}

      {/* İndirim Etiketi */}
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

      {/* İsim */}
      <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
        {p.name}
      </p>

      {/* Rating & Satış */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-0.5">
          <Star size={10} className="fill-[#FAAD14] text-[#FAAD14]" />
          <span className="text-xs text-gray-500">{p.rating}</span>
        </div>
        <span className="text-[10px] text-gray-400">
          {p.sold?.toLocaleString("tr-TR")} satış
        </span>
      </div>

      {/* Stok Çubuğu */}
      <div className="mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#FF6600] to-[#FF0036] rounded-full"
          style={{ width: `${Math.min(85, 40 + Math.random() * 45)}%` }}
        />
      </div>
      <p className="text-[9px] text-gray-400 mt-0.5 text-right">Az kaldı!</p>
    </a>
  );
}
