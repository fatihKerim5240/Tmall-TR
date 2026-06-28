"use client";
import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, ShoppingCart, Heart, Share2, ChevronRight, Shield,
  Truck, RotateCcw, Plus, Minus, Check, Store, ChevronLeft,
  ZoomIn, Package, Tag, Award,
} from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { getProductById, getRelatedProducts, ALL_PRODUCTS } from "@/lib/products";
import { FLASH_PRODUCTS, FEATURED_PRODUCTS } from "@/lib/data";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

const ALL_KNOWN = [...ALL_PRODUCTS, ...FLASH_PRODUCTS, ...FEATURED_PRODUCTS];

interface Props { params: Promise<{ id: string }> }

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  let product = getProductById(id);
  if (!product) product = ALL_KNOWN.find((p) => p.id === id);

  if (!product) {
    return (
      <PageWrapper>
        <div className="max-w-[1200px] mx-auto py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Ürün Bulunamadı</h2>
          <p className="text-gray-400 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0036] text-white rounded-lg text-sm font-semibold hover:bg-[#CC0029] transition-colors">
            Alışverişe Devam Et
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const related = getRelatedProducts(product, 5);
  const images = product.images ?? [product.image, product.image, product.image];

  return (
    <PageWrapper>
      <PDPContent product={product} images={images} related={related} />
    </PageWrapper>
  );
}

/* ── Görsel Zoom bileşeni ── */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 cursor-zoom-in select-none"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMove}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: zoomed ? "scale(2.4)" : "scale(1)",
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transition: zoomed ? "transform-origin 0.05s linear" : "transform 0.25s ease",
          willChange: "transform",
        }}
      >
        <Image src={src} alt={alt} fill className="object-cover" priority />
      </div>
      {!zoomed && (
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
          <ZoomIn size={10} /> Büyütmek için üzerine gel
        </div>
      )}
    </div>
  );
}

/* ── Renk varyant eşleşmesi ── */
const COLOR_MAP: Record<string, string> = {
  siyah: "#1a1a1a", beyaz: "#f5f5f5", kırmızı: "#FF0036", mavi: "#2563eb",
  lacivert: "#1e3a8a", yeşil: "#16a34a", sarı: "#eab308", turuncu: "#f97316",
  pembe: "#ec4899", mor: "#9333ea", gri: "#6b7280", kahverengi: "#92400e",
  bej: "#d4b896", krem: "#fdf5e6", gümüş: "#c0c0c0", altın: "#ffd700",
  rose: "#e11d48", mint: "#34d399", "açık mavi": "#60a5fa",
};

function getColorHex(option: string): string | null {
  const lower = option.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return null;
}

/* ── Teknik özellikler üretici ── */
function generateSpecs(p: ReturnType<typeof getProductById>): Array<{ label: string; value: string }> {
  if (!p) return [];
  const specs: Array<{ label: string; value: string }> = [];
  if (p.brand) specs.push({ label: "Marka", value: p.brand.toUpperCase() });
  if (p.category) specs.push({ label: "Kategori", value: p.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) });
  if (p.stock !== undefined) specs.push({ label: "Stok", value: `${p.stock} adet` });
  if (p.sold) specs.push({ label: "Satış Adedi", value: `${p.sold.toLocaleString("tr-TR")}+` });
  if (p.rating) specs.push({ label: "Değerlendirme", value: `${p.rating} / 5` });
  if (p.ratingCount) specs.push({ label: "Yorum Sayısı", value: p.ratingCount.toLocaleString("tr-TR") });
  p.variants?.forEach((v) => specs.push({ label: v.name, value: v.options.join(", ") }));
  return specs;
}

/* ── PDPContent ── */
function PDPContent({
  product: p, images, related,
}: {
  product: NonNullable<ReturnType<typeof getProductById>>;
  images: string[];
  related: ReturnType<typeof getRelatedProducts>;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs">("desc");

  const addItem = useCartStore((s) => s.addItem);
  const { items: favItems, toggle } = useFavoritesStore();

  useEffect(() => setMounted(true), []);

  const wishlisted = mounted && favItems.some((f) => f.id === p.id);

  const handleAddToCart = () => {
    addItem(p, selectedVariants, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const specs = generateSpecs(p);
  const savings = p.originalPrice && p.discount
    ? p.originalPrice - p.price
    : null;

  return (
    <div className="max-w-[1200px] mx-auto py-4 px-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</Link>
        <ChevronRight size={12} />
        {p.category && (
          <>
            <Link href={`/${p.category}`} className="hover:text-[#FF0036] transition-colors capitalize">
              {p.category.replace("-", " ")}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-gray-600 truncate max-w-[200px]">{p.name}</span>
      </nav>

      {/* ── Ana panel ── */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 mb-4 shadow-sm">
        <div className="flex flex-col lg:grid lg:grid-cols-[300px,1fr,280px] gap-6 lg:gap-8">

          {/* ── Sol: Görsel galerisi ── */}
          <div>
            {/* Zoom destekli ana görsel */}
            <ZoomImage src={images[selectedImage] ?? p.image} alt={p.name} />

            {/* Küçük görseller */}
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === i
                      ? "border-[#FF0036] shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image src={img} alt={`görsel ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Navigation okları – thumbnail'ların altında */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                  className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs text-gray-400 self-center">
                  {selectedImage + 1} / {images.length}
                </span>
                <button
                  onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                  className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* ── Orta: Ürün bilgisi ── */}
          <div className="min-w-0 flex flex-col gap-4">
            {/* Mağaza */}
            <Link
              href={p.brand ? `/brand/${p.brand}` : "#"}
              className="inline-flex items-center gap-1.5 text-xs text-[#FF0036] font-semibold hover:underline w-fit"
            >
              <Store size={12} />
              {p.shop}
              {p.brand && <span className="text-gray-400 font-normal">· {p.brand.toUpperCase()}</span>}
            </Link>

            {/* İsim */}
            <h1 className="text-xl font-bold text-gray-800 leading-snug">{p.name}</h1>

            {/* Rating çubuğu */}
            {p.rating !== undefined && (
              <div className="flex items-center gap-3 py-2 border-y border-gray-100">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(p.rating!) ? "fill-[#FAAD14] text-[#FAAD14]" : "fill-gray-200 text-gray-200"}
                    />
                  ))}
                  <span className="text-sm font-bold text-[#FAAD14] ml-1">{p.rating}</span>
                </div>
                {p.ratingCount && (
                  <span className="text-xs text-gray-400 border-l border-gray-200 pl-3">
                    {p.ratingCount.toLocaleString("tr-TR")} değerlendirme
                  </span>
                )}
                {p.sold !== undefined && (
                  <span className="text-xs text-gray-400 border-l border-gray-200 pl-3">
                    {p.sold.toLocaleString("tr-TR")} satış
                  </span>
                )}
              </div>
            )}

            {/* Fiyat kutusu */}
            <div className="bg-gradient-to-r from-[#FFF5F5] to-[#FFF8F0] rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#FF0036]">
                  {p.price.toLocaleString("tr-TR")}₺
                </span>
                {p.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    {p.originalPrice.toLocaleString("tr-TR")}₺
                  </span>
                )}
                {p.discount && (
                  <span className="bg-[#FF0036] text-white text-xs font-black px-2 py-0.5 rounded-full">
                    %{p.discount} İndirim
                  </span>
                )}
              </div>
              {savings && (
                <p className="text-sm text-green-600 font-semibold mt-1 flex items-center gap-1">
                  <Tag size={12} />
                  {savings.toLocaleString("tr-TR")}₺ tasarruf ediyorsun!
                </p>
              )}
            </div>

            {/* Varyantlar */}
            {p.variants?.map((variant) => {
              const isColor = variant.name.toLowerCase().includes("renk");
              return (
                <div key={variant.name}>
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    {variant.name}:
                    <span className="font-normal text-[#FF0036]">
                      {selectedVariants[variant.name] ?? "Seçiniz"}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((opt) => {
                      const colorHex = isColor ? getColorHex(opt) : null;
                      const selected = selectedVariants[variant.name] === opt;

                      return colorHex ? (
                        /* Renk yuvarlak buton */
                        <button
                          key={opt}
                          title={opt}
                          onClick={() => setSelectedVariants((s) => ({ ...s, [variant.name]: opt }))}
                          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                            selected ? "border-[#FF0036] scale-110 shadow-md" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: colorHex }}
                        >
                          {selected && (
                            <span className="flex items-center justify-center w-full h-full">
                              <Check size={12} className={colorHex === "#f5f5f5" ? "text-gray-700" : "text-white"} />
                            </span>
                          )}
                        </button>
                      ) : (
                        /* Normal metin butonu */
                        <button
                          key={opt}
                          onClick={() => setSelectedVariants((s) => ({ ...s, [variant.name]: opt }))}
                          className={`px-3.5 py-1.5 text-sm rounded-lg border-2 transition-all font-medium ${
                            selected
                              ? "border-[#FF0036] bg-[#FF0036]/5 text-[#FF0036]"
                              : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {opt}
                          {selected && <Check size={11} className="inline ml-1 text-[#FF0036]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Açıklama / Teknik Özellikler sekmeleri */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(["desc", "specs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                      activeTab === tab
                        ? "bg-[#FF0036] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "desc" ? "Ürün Hakkında" : "Teknik Özellikler"}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {activeTab === "desc" ? (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {p.description ?? `${p.name} — Kaliteli malzeme ve özenli işçilikle üretilmiş bu ürün, günlük kullanım için idealdir. ${p.shop} güvencesiyle sunulmaktadır.`}
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map((s, i) => (
                        <tr key={s.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="py-2 px-3 font-semibold text-gray-600 w-1/3 rounded-l">{s.label}</td>
                          <td className="py-2 px-3 text-gray-800 rounded-r">{s.value}</td>
                        </tr>
                      ))}
                      {specs.length === 0 && (
                        <tr>
                          <td colSpan={2} className="py-4 text-center text-gray-400 text-xs">
                            Teknik özellik bilgisi bulunmuyor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* ── Sağ: Satın alma paneli ── */}
          <div className="flex flex-col gap-3">
            {/* Stok & fiyat kutusu */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 space-y-3">
              {/* Stok durumu */}
              {p.stock !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      p.stock > 10 ? "bg-green-500" : p.stock > 0 ? "bg-[#FAAD14]" : "bg-gray-300"
                    }`}
                  />
                  <span className={p.stock > 10 ? "text-green-600 font-medium" : p.stock > 0 ? "text-orange-500 font-medium" : "text-gray-400"}>
                    {p.stock > 10 ? "Stokta mevcut" : p.stock > 0 ? `Son ${p.stock} ürün!` : "Stok tükendi"}
                  </span>
                </div>
              )}

              {/* Kargo */}
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <Truck size={12} className="text-green-500" />
                {p.price >= 750
                  ? <span className="text-green-600 font-semibold">Ücretsiz kargo</span>
                  : "Bu üründe kargo ücreti uygulanır"}
              </div>

              {/* Adet seçici */}
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Adet</p>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 border border-gray-200 rounded-l-lg flex items-center justify-center hover:border-[#FF0036] hover:text-[#FF0036] hover:bg-red-50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 h-9 border-y border-gray-200 text-center text-sm font-bold text-gray-800 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 border border-gray-200 rounded-r-lg flex items-center justify-center hover:border-[#FF0036] hover:text-[#FF0036] hover:bg-red-50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  {p.stock !== undefined && quantity >= p.stock && p.stock > 0 && (
                    <span className="ml-2 text-[10px] text-orange-500">Maksimum stok</span>
                  )}
                </div>
              </div>

              {/* Toplam fiyat */}
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Toplam</span>
                <span className="text-xl font-black text-[#FF0036]">
                  {(p.price * quantity).toLocaleString("tr-TR")}₺
                </span>
              </div>

              {/* Sepete Ekle */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-[#FF0036] hover:bg-[#CC0029] active:bg-[#AA0020] text-white"
                }`}
              >
                {addedToCart ? (
                  <><Check size={18} /> Sepete Eklendi!</>
                ) : (
                  <><ShoppingCart size={18} /> Sepete Ekle</>
                )}
              </button>

              {/* Hemen Satın Al */}
              <Link
                href="/odeme"
                onClick={() => !addedToCart && addItem(p, selectedVariants, quantity)}
                className="w-full py-3 rounded-xl border-2 border-[#FF0036] text-[#FF0036] font-bold text-sm hover:bg-red-50 active:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Package size={15} />
                Hemen Satın Al
              </Link>

              {/* Favorilere Ekle */}
              <button
                onClick={() => toggle(p)}
                className={`w-full py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-[#FF0036]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart size={14} className={wishlisted ? "fill-[#FF0036]" : ""} />
                {wishlisted ? "Favorilerde ✓" : "Favorilere Ekle"}
              </button>
            </div>

            {/* Teslimat & güven */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {[
                { icon: <Truck size={14} className="text-green-500 flex-shrink-0" />, text: "Ücretsiz kargo", sub: "750₺ üzeri siparişlerde" },
                { icon: <RotateCcw size={14} className="text-blue-500 flex-shrink-0" />, text: "30 gün iade", sub: "Koşulsuz iade garantisi" },
                { icon: <Shield size={14} className="text-[#FF0036] flex-shrink-0" />, text: "Güvenli ödeme", sub: "256-bit SSL şifreleme" },
                { icon: <Award size={14} className="text-amber-500 flex-shrink-0" />, text: "Orijinal ürün", sub: "Tmall TR güvencesiyle" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  {item.icon}
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                    <p className="text-[10px] text-gray-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Paylaş */}
            <button className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 size={12} />
              Ürünü Paylaş
            </button>
          </div>
        </div>
      </div>

      {/* ── Benzer Ürünler ── */}
      {related.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
            <h2 className="font-black text-gray-800">Benzer Ürünler</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
