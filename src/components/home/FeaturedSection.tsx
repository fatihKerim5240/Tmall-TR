import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import { FEATURED_PRODUCTS } from "@/lib/data";

export function FeaturedSection() {
  return (
    <section className="max-w-[1200px] mx-auto mb-4">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
            <h2 className="font-black text-gray-800 text-lg">Sizin İçin Seçtiklerimiz</h2>
          </div>
          <a
            href="/oneriler"
            className="flex items-center gap-1 text-sm text-[#FF0036] font-medium hover:underline"
          >
            Daha Fazla <ChevronRight size={16} />
          </a>
        </div>

        {/* Ürünler */}
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {FEATURED_PRODUCTS.map((p) => (
            <a
              key={p.id}
              href={`/urun/${p.id}`}
              className="p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="relative aspect-square mb-3 overflow-hidden rounded bg-gray-50">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.discount && (
                  <span className="absolute top-2 right-2 bg-[#FF0036] text-white text-xs font-black px-1.5 py-0.5 rounded">
                    %{p.discount}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 line-clamp-2 leading-snug mb-2">
                {p.name}
              </p>

              <div className="flex items-baseline gap-1.5">
                <span className="text-[#FF0036] font-black">
                  {p.price.toLocaleString("tr-TR")}₺
                </span>
                {p.originalPrice && (
                  <span className="text-gray-400 text-xs line-through">
                    {p.originalPrice.toLocaleString("tr-TR")}₺
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i < Math.round(p.rating ?? 0)
                          ? "fill-[#FAAD14] text-[#FAAD14]"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  ({p.sold?.toLocaleString("tr-TR")})
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1 truncate">{p.shop}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
