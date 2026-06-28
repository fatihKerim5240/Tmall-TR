import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { SidebarShell } from "@/components/shared/SidebarShell";
import { NAV_CATEGORIES } from "@/lib/data";
import { getProductsByCategory } from "@/lib/products";

const VALID_CATEGORIES = NAV_CATEGORIES.map((c) => c.id);

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((cat) => ({ category: cat }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const catData = NAV_CATEGORIES.find((c) => c.id === category)!;
  const products = getProductsByCategory(category);

  const sidebar = (
    <>
      {/* Alt kategoriler */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="font-bold text-sm text-gray-800 mb-3">{catData.name}</h3>
        <ul className="space-y-1">
          {catData.subCategories?.map((sub) => (
            <li key={sub.name}>
              <a
                href={sub.href}
                className="flex items-center justify-between text-sm text-gray-600 hover:text-[#FF0036] py-1.5 transition-colors group"
              >
                <span>{sub.name}</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#FF0036]" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Fiyat filtresi */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="font-bold text-sm text-gray-800 mb-3">Fiyat Aralığı</h3>
        <div className="flex gap-2 items-center mb-3">
          <input
            type="number"
            placeholder="Min ₺"
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#FF0036]"
          />
          <span className="text-gray-300 flex-shrink-0">—</span>
          <input
            type="number"
            placeholder="Max ₺"
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#FF0036]"
          />
        </div>
        <button className="w-full py-2 bg-[#FF0036] text-white text-xs font-semibold rounded hover:bg-[#CC0029] transition-colors">
          Uygula
        </button>
      </div>

      {/* Puan filtresi */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <h3 className="font-bold text-sm text-gray-800 mb-3">Değerlendirme</h3>
        {[4, 3, 2].map((stars) => (
          <label key={stars} className="flex items-center gap-2 cursor-pointer py-1 group">
            <input type="radio" name="rating" className="accent-[#FF0036]" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xs ${i < stars ? "text-[#FAAD14]" : "text-gray-200"}`}>★</span>
              ))}
              <span className="text-xs text-gray-500">ve üzeri</span>
            </div>
          </label>
        ))}
      </div>

      {/* Öne çıkan markalar */}
      {catData.featured && catData.featured.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h3 className="font-bold text-sm text-gray-800 mb-3">Öne Çıkan Markalar</h3>
          <div className="space-y-2">
            {catData.featured.map((brand) => (
              <a
                key={brand.name}
                href={brand.href}
                className="flex items-center justify-between text-sm text-gray-600 hover:text-[#FF0036] py-1 transition-colors group"
              >
                <span>{brand.name}</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-[#FF0036]" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</a>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">{catData.name}</span>
        </nav>

        <SidebarShell sidebar={sidebar}>
          {/* Sıralama çubuğu */}
          <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            <SlidersHorizontal size={15} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-500 flex-shrink-0">Sırala:</span>
            {["Önerilen", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Fiyat", "En Yüksek Puan"].map(
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
              {products.length > 0 ? `${products.length} ürün bulundu` : "Ürün bulunamadı"}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyCategory categoryName={catData.name} />
          )}
        </SidebarShell>
      </div>
    </PageWrapper>
  );
}

function EmptyCategory({ categoryName }: { categoryName: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
      <div className="text-6xl mb-4">🛍️</div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">
        {categoryName} için ürünler yakında
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Bu kategoriye özel ürünler çok yakında burada olacak. Anasayfada öne çıkan ürünleri keşfedebilirsiniz.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF0036] text-white rounded-lg text-sm font-semibold hover:bg-[#CC0029] transition-colors"
      >
        Anasayfaya Dön
      </a>
    </div>
  );
}
