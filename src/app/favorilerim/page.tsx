"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ChevronRight, Star } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useCartStore } from "@/store/useCartStore";

export default function FavorilerimPage() {
  const [mounted, setMounted] = useState(false);
  const { items, remove } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

  const handleAddToCart = (productId: string) => {
    const product = items.find((p) => p.id === productId);
    if (!product) return;
    addItem(product);
    setAddedIds((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }, 2000);
  };

  if (!mounted) return null;

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Favorilerim</span>
        </nav>

        <div className="flex items-center gap-3 mb-5">
          <Heart size={20} className="text-[#FF0036] fill-[#FF0036]" />
          <h1 className="text-xl font-black text-gray-800">
            Favorilerim
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({items.length} ürün)
              </span>
            )}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <Heart size={56} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-600 mb-2">Favori listeniz boş</h2>
            <p className="text-sm text-gray-400 mb-6">
              Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyin.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0036] text-white rounded-lg text-sm font-semibold hover:bg-[#CC0029] transition-colors"
            >
              Keşfetmeye Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {items.map((product) => {
              const added = addedIds.has(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col"
                >
                  {/* Görsel */}
                  <Link href={`/urun/${product.id}`} className="relative aspect-square block overflow-hidden bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount && (
                      <span className="absolute top-2 left-2 bg-[#FF0036] text-white text-[11px] font-black px-1.5 py-0.5 rounded">
                        %{product.discount}
                      </span>
                    )}
                    {/* Favoriden çıkar */}
                    <button
                      onClick={() => remove(product.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                      title="Favorilerden çıkar"
                    >
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </Link>

                  {/* Bilgi */}
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <Link href={`/urun/${product.id}`}>
                      <p className="text-sm text-gray-700 line-clamp-2 hover:text-[#FF0036] transition-colors leading-snug">
                        {product.name}
                      </p>
                    </Link>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[#FF0036] font-black">
                        {product.price.toLocaleString("tr-TR")}₺
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through">
                          {product.originalPrice.toLocaleString("tr-TR")}₺
                        </span>
                      )}
                    </div>

                    {product.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={
                              i < Math.round(product.rating!)
                                ? "fill-[#FAAD14] text-[#FAAD14]"
                                : "fill-gray-200 text-gray-200"
                            }
                          />
                        ))}
                        <span className="text-[11px] text-gray-400">{product.rating}</span>
                      </div>
                    )}

                    <p className="text-[11px] text-gray-400 truncate">{product.shop}</p>

                    {/* Sepete Ekle */}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`mt-auto w-full py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                        added
                          ? "bg-green-500 text-white"
                          : "bg-[#FF0036] hover:bg-[#CC0029] text-white"
                      }`}
                    >
                      <ShoppingCart size={13} />
                      {added ? "Eklendi!" : "Sepete Ekle"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
