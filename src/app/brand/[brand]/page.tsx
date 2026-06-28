import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronRight, Store, Tag } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { getProductsByBrand, BRANDS } from "@/lib/products";
import { NAV_CATEGORIES } from "@/lib/data";

interface Props {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateStaticParams() {
  return Object.keys(BRANDS).map((brand) => ({ brand }));
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { brand } = await params;
  const { category } = await searchParams;

  const brandData = BRANDS[brand];
  if (!brandData) notFound();

  const allBrandProducts = getProductsByBrand(brand);
  const products = category
    ? allBrandProducts.filter((p) => p.category === category)
    : allBrandProducts;

  const categoryData = category
    ? NAV_CATEGORIES.find((c) => c.id === category)
    : null;

  return (
    <PageWrapper>
      {/* Marka banner */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 mb-4">
        {brandData.banner && (
          <Image
            src={brandData.banner}
            alt={brandData.name}
            fill
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-lg">
            <Store size={28} className="text-[#FF0036]" />
          </div>
          <h1 className="text-2xl font-black">{brandData.name}</h1>
          <p className="text-white/70 text-sm mt-1 max-w-md text-center">
            {brandData.description}
          </p>
          {categoryData && (
            <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white">
              <Tag size={11} />
              {categoryData.name}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 px-1">
          <a href="/" className="hover:text-[#FF0036] transition-colors">
            Anasayfa
          </a>
          <ChevronRight size={12} />
          <a href="/markalar" className="hover:text-[#FF0036] transition-colors">
            Markalar
          </a>
          {categoryData && (
            <>
              <ChevronRight size={12} />
              <a
                href={`/markalar?category=${category}`}
                className="hover:text-[#FF0036] transition-colors"
              >
                {categoryData.name}
              </a>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">{brandData.name}</span>
        </nav>

        {/* Kategori filtresi aktifse bilgilendirme + diğer kategoriler */}
        {categoryData && (
          <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-4 py-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-[#FF0036] rounded-full" />
              <span>
                <span className="font-semibold text-gray-800">
                  {categoryData.name}
                </span>{" "}
                kategorisindeki{" "}
                <span className="font-semibold text-[#FF0036]">
                  {brandData.name}
                </span>{" "}
                ürünleri
              </span>
            </div>
            <a
              href={`/brand/${brand}`}
              className="text-xs text-gray-400 hover:text-[#FF0036] transition-colors"
            >
              Tüm ürünleri gör →
            </a>
          </div>
        )}

        {/* Sıralama çubuğu */}
        <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
          <span className="text-sm text-gray-500 flex-shrink-0">Sırala:</span>
          {["Önerilen", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Fiyat"].map(
            (opt, i) => (
              <button
                key={opt}
                className={`text-sm px-3 py-1 rounded transition-colors whitespace-nowrap flex-shrink-0 ${
                  i === 0
                    ? "bg-[#FF0036] text-white"
                    : "text-gray-600 hover:text-[#FF0036] hover:bg-red-50"
                }`}
              >
                {opt}
              </button>
            )
          )}
          <span className="ml-auto text-xs text-gray-400 flex-shrink-0 pl-2">
            {products.length} ürün
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-100 p-16 text-center">
            <div className="text-5xl mb-4">🏷️</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {categoryData
                ? `${categoryData.name} kategorisinde ${brandData.name} ürünü bulunamadı`
                : `${brandData.name} ürünleri yakında`}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {categoryData
                ? "Diğer kategorilerdeki ürünleri görmek için tüm ürünler sayfasını ziyaret edin."
                : "Bu markaya ait ürünler çok yakında eklenecek."}
            </p>
            <div className="flex items-center justify-center gap-3">
              {categoryData && (
                <a
                  href={`/brand/${brand}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0036] text-white rounded-lg text-sm font-semibold hover:bg-[#CC0029] transition-colors"
                >
                  Tüm {brandData.name} Ürünleri
                </a>
              )}
              <a
                href="/markalar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Tüm Markalar
              </a>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
