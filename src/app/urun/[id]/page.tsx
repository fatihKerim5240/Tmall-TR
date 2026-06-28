"use client";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Store,
  ChevronLeft,
} from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { getProductById, getRelatedProducts, ALL_PRODUCTS } from "@/lib/products";
import { FLASH_PRODUCTS, FEATURED_PRODUCTS } from "@/lib/data";

const ALL_KNOWN = [...ALL_PRODUCTS, ...FLASH_PRODUCTS, ...FEATURED_PRODUCTS];

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);

  // Try our full catalog first, then legacy data
  let product = getProductById(id);
  if (!product) {
    product = ALL_KNOWN.find((p) => p.id === id);
  }

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

function PDPContent({
  product: p,
  images,
  related,
}: {
  product: NonNullable<ReturnType<typeof getProductById>>;
  images: string[];
  related: ReturnType<typeof getRelatedProducts>;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto py-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 px-1">
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

      {/* Ana ürün grid */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <div className="grid grid-cols-[auto,1fr,300px] gap-8">
          {/* Sol: Görseller */}
          <div className="w-80">
            {/* Ana görsel */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3 group">
              <Image
                src={images[selectedImage] ?? p.image}
                alt={p.name}
                fill
                className="object-cover"
                priority
              />
              {p.discount && (
                <span className="absolute top-3 left-3 bg-[#FF0036] text-white text-sm font-black px-2 py-1 rounded">
                  %{p.discount} İndirim
                </span>
              )}
              {/* Önceki / sonraki */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Küçük görseller */}
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                    selectedImage === i ? "border-[#FF0036]" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image src={img} alt={`görsel ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Orta: Ürün bilgisi */}
          <div className="min-w-0">
            {/* Mağaza */}
            <Link
              href={p.brand ? `/brand/${p.brand}` : "#"}
              className="inline-flex items-center gap-1.5 text-xs text-[#FF0036] font-semibold mb-2 hover:underline"
            >
              <Store size={12} />
              {p.shop}
            </Link>

            {/* İsim */}
            <h1 className="text-lg font-bold text-gray-800 leading-snug mb-3">{p.name}</h1>

            {/* Rating */}
            {p.rating !== undefined && (
              <div className="flex items-center gap-3 mb-4">
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
            <div className="bg-gradient-to-r from-[#FFF5F5] to-[#FFF0E6] rounded-xl p-4 mb-5">
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
                  <span className="bg-[#FF0036] text-white text-xs font-black px-2 py-0.5 rounded">
                    %{p.discount} İndirim
                  </span>
                )}
              </div>
              {p.discount && p.originalPrice && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  {(p.originalPrice - p.price).toLocaleString("tr-TR")}₺ tasarruf ediyorsun!
                </p>
              )}
            </div>

            {/* Varyantlar */}
            {p.variants?.map((variant) => (
              <div key={variant.name} className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {variant.name}:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedVariants[variant.name] ?? "Seçiniz"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants((s) => ({ ...s, [variant.name]: opt }))}
                      className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all ${
                        selectedVariants[variant.name] === opt
                          ? "border-[#FF0036] bg-[#FF0036]/5 text-[#FF0036] font-semibold"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Açıklama */}
            {p.description && (
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Ürün Hakkında</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
              </div>
            )}
          </div>

          {/* Sağ: Satın alma paneli */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 space-y-4">
              {/* Stok durumu */}
              {p.stock !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? "bg-green-500" : p.stock > 0 ? "bg-[#FAAD14]" : "bg-gray-300"}`} />
                  <span className={p.stock > 10 ? "text-green-600" : p.stock > 0 ? "text-orange-500" : "text-gray-400"}>
                    {p.stock > 10 ? "Stokta mevcut" : p.stock > 0 ? `Son ${p.stock} ürün!` : "Stok tükendi"}
                  </span>
                </div>
              )}

              {/* Miktar */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Adet</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 border border-gray-200 rounded flex items-center justify-center hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Toplam fiyat */}
              <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Toplam</span>
                <span className="text-lg font-black text-[#FF0036]">
                  {(p.price * quantity).toLocaleString("tr-TR")}₺
                </span>
              </div>

              {/* Sepete Ekle butonu */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-[#FF0036] hover:bg-[#CC0029] text-white"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} />
                    Sepete Eklendi!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Sepete Ekle
                  </>
                )}
              </button>

              {/* Hemen Satın Al */}
              <button className="w-full py-3 rounded-xl border-2 border-[#FF0036] text-[#FF0036] font-bold text-sm hover:bg-red-50 transition-colors">
                Hemen Satın Al
              </button>

              {/* Favorilere Ekle */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className={`w-full py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-[#FF0036]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart size={14} className={wishlisted ? "fill-[#FF0036]" : ""} />
                {wishlisted ? "Favorilerde" : "Favorilere Ekle"}
              </button>
            </div>

            {/* Teslimat & güven */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {[
                { icon: <Truck size={15} className="text-green-500" />, text: "Ücretsiz kargo", sub: "750₺ üzeri siparişlerde" },
                { icon: <RotateCcw size={15} className="text-blue-500" />, text: "30 gün iade", sub: "Koşulsuz iade garantisi" },
                { icon: <Shield size={15} className="text-[#FF0036]" />, text: "Güvenli ödeme", sub: "256-bit SSL şifreleme" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{item.text}</p>
                    <p className="text-[10px] text-gray-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Paylaş */}
            <button className="w-full py-2 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 size={13} />
              Ürünü Paylaş
            </button>
          </div>
        </div>
      </div>

      {/* İlgili ürünler */}
      {related.length > 0 && (
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
              <h2 className="font-black text-gray-800">Benzer Ürünler</h2>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
