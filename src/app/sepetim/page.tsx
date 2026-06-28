"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, Tag, Truck, Shield } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { useCartStore } from "@/store/useCartStore";

export default function SepetimPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 750 ? 0 : 49;
  const total = subtotal + shipping;

  if (!mounted) return null;

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Sepetim</span>
        </nav>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-black text-gray-800">
            Sepetim
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({items.reduce((s, i) => s + i.quantity, 0)} ürün)
              </span>
            )}
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} />
              Sepeti Temizle
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Boş sepet */
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <ShoppingBag size={56} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-600 mb-2">Sepetiniz boş</h2>
            <p className="text-sm text-gray-400 mb-6">
              Beğendiğiniz ürünleri sepetinize ekleyin.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0036] text-white rounded-lg text-sm font-semibold hover:bg-[#CC0029] transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            {/* Sol — Ürünler */}
            <div className="flex-1 min-w-0 space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:border-gray-200 transition-colors"
                >
                  {/* Görsel */}
                  <Link href={`/urun/${item.product.id}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50 hover:opacity-90 transition-opacity">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                  </Link>

                  {/* Bilgi */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/urun/${item.product.id}`}>
                      <p className="text-sm font-semibold text-gray-800 hover:text-[#FF0036] transition-colors line-clamp-2 mb-1">
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-xs text-gray-400 mb-1">{item.product.shop}</p>
                    {item.variants && Object.keys(item.variants).length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {Object.entries(item.variants).map(([k, v]) => (
                          <span key={k} className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.product.discount && (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-[#FF0036] px-2 py-0.5 rounded font-semibold mb-2">
                        <Tag size={10} />
                        %{item.product.discount} indirim uygulandı
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Adet */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 hover:text-[#FF0036] transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500 hover:text-[#FF0036] transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Fiyat + Sil */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-base font-black text-[#FF0036]">
                            {(item.product.price * item.quantity).toLocaleString("tr-TR")}₺
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-gray-400">
                              Birim: {item.product.price.toLocaleString("tr-TR")}₺
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Güven çubuğu */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-around">
                {[
                  { icon: <Truck size={16} className="text-green-500" />, text: "750₺ üzeri ücretsiz kargo" },
                  { icon: <Shield size={16} className="text-blue-500" />, text: "Güvenli ödeme" },
                  { icon: <Tag size={16} className="text-[#FF6600]" />, text: "30 gün iade garantisi" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500">
                    {b.icon}
                    {b.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ — Özet */}
            <div className="w-80 flex-shrink-0 space-y-3 sticky top-24">
              {/* Promosyon kodu */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Promosyon Kodu</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Kodu girin"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF0036]"
                  />
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors">
                    Uygula
                  </button>
                </div>
              </div>

              {/* Özet */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Sipariş Özeti</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam ({items.reduce((s, i) => s + i.quantity, 0)} ürün)</span>
                    <span>{subtotal.toLocaleString("tr-TR")}₺</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                      {shipping === 0 ? "Ücretsiz" : `${shipping}₺`}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 750 && (
                    <p className="text-[11px] text-[#FF6600] bg-orange-50 rounded-lg px-3 py-2">
                      {(750 - subtotal).toLocaleString("tr-TR")}₺ daha ekleyin, kargo ücretsiz olsun!
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
                  <span className="font-bold text-gray-800">Toplam</span>
                  <span className="text-2xl font-black text-[#FF0036]">
                    {total.toLocaleString("tr-TR")}₺
                  </span>
                </div>

                <Link
                  href="/odeme"
                  className="mt-4 w-full py-3.5 bg-[#FF0036] hover:bg-[#CC0029] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Alışverişi Tamamla
                  <ChevronRight size={16} />
                </Link>

                <p className="text-[10px] text-gray-400 text-center mt-3">
                  🔒 256-bit SSL ile şifrelenmiş güvenli ödeme
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
