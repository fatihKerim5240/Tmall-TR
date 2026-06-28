"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product: p, className = "" }: ProductCardProps) {
  return (
    <Link
      href={`/urun/${p.id}`}
      className={`group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 hover:border-red-100 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={p.image}
          alt={p.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {p.discount && (
          <span className="absolute top-2 left-2 bg-[#FF0036] text-white text-[11px] font-black px-1.5 py-0.5 rounded">
            %{p.discount}
          </span>
        )}
        {p.badge && !p.discount && (
          <span className="absolute top-2 left-2 bg-[#FF6600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {p.badge}
          </span>
        )}
        {p.badge && p.discount && (
          <span className="absolute top-2 right-2 bg-[#FF6600] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {p.badge}
          </span>
        )}
        <button
          className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 z-10"
          onClick={(e) => e.preventDefault()}
          aria-label="Favorilere ekle"
        >
          <Heart size={14} className="text-gray-400 hover:text-[#FF0036] transition-colors" />
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-sm text-gray-700 line-clamp-2 leading-snug flex-1">{p.name}</p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[#FF0036] font-black text-base">
            {p.price.toLocaleString("tr-TR")}₺
          </span>
          {p.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              {p.originalPrice.toLocaleString("tr-TR")}₺
            </span>
          )}
        </div>

        {(p.rating !== undefined || p.sold !== undefined) && (
          <div className="flex items-center justify-between">
            {p.rating !== undefined && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < Math.round(p.rating!)
                          ? "fill-[#FAAD14] text-[#FAAD14]"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-[11px] text-gray-400">{p.rating}</span>
              </div>
            )}
            {p.sold !== undefined && (
              <span className="text-[10px] text-gray-400">
                {p.sold.toLocaleString("tr-TR")} satış
              </span>
            )}
          </div>
        )}

        <p className="text-[11px] text-gray-400 truncate">{p.shop}</p>

        <button
          className="mt-1 w-full py-2 bg-[#FF0036] hover:bg-[#CC0029] active:bg-[#AA0020] text-white text-sm font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
          onClick={(e) => e.preventDefault()}
        >
          <ShoppingCart size={14} />
          Sepete Ekle
        </button>
      </div>
    </Link>
  );
}
