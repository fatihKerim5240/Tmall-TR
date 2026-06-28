"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_BANNERS, QUICK_CATEGORIES } from "@/lib/data";

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % HERO_BANNERS.length);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + HERO_BANNERS.length) % HERO_BANNERS.length);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next]);

  const banner = HERO_BANNERS[current];

  return (
    <div className="max-w-[1200px] mx-auto py-3 flex gap-3">
      {/* Slider */}
      <div
        className="relative flex-1 rounded-lg overflow-hidden"
        style={{ height: "380px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        {HERO_BANNERS.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={b.image}
              alt={b.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
            {/* Overlay Metin */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h2 className="text-white text-2xl font-black leading-tight drop-shadow-md max-w-xs">
                  {b.title}
                </h2>
                {b.subtitle && (
                  <p className="text-white/80 text-sm mt-1">{b.subtitle}</p>
                )}
                <a
                  href={b.href}
                  className="mt-3 inline-block bg-[#FF0036] hover:bg-[#CC0029] text-white text-sm font-bold px-5 py-2 rounded transition-colors"
                >
                  Hemen Al →
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sağ Panel — Hızlı Kategoriler */}
      <div
        className="w-[180px] flex-shrink-0 bg-white rounded-lg overflow-hidden flex flex-col"
        style={{ height: "380px" }}
      >
        <div className="bg-[#FF0036] text-white text-xs font-bold px-3 py-2 text-center">
          KATEGORİLER
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {QUICK_CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 transition-colors border-b border-gray-50 group"
            >
              <span
                className="text-lg w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color + "22" }}
              >
                {cat.icon}
              </span>
              <span className="text-xs text-gray-700 group-hover:text-[#FF0036] font-medium transition-colors line-clamp-1">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
