import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { SidebarShell } from "@/components/shared/SidebarShell";
import { NAV_CATEGORIES } from "@/lib/data";
import { getProductsByCategory } from "@/lib/products";

interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

export async function generateStaticParams() {
  const params: { category: string; subcategory: string }[] = [];
  for (const cat of NAV_CATEGORIES) {
    for (const sub of cat.subCategories ?? []) {
      const parts = sub.href.split("/").filter(Boolean);
      if (parts.length === 2) {
        params.push({ category: parts[0], subcategory: parts[1] });
      }
    }
  }
  return params;
}

export default async function SubCategoryPage({ params }: Props) {
  const { category, subcategory } = await params;

  const catData = NAV_CATEGORIES.find((c) => c.id === category);
  if (!catData) notFound();

  const subData = catData.subCategories?.find((s) => {
    const slug = s.href.split("/").pop();
    return slug === subcategory;
  });

  const products = getProductsByCategory(category);

  const sidebar = (
    <>
      {/* Alt kategoriler listesi */}
      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <a
          href={`/${category}`}
          className="font-bold text-sm text-gray-800 hover:text-[#FF0036] transition-colors block mb-3"
        >
          {catData.name}
        </a>
        <ul className="space-y-1">
          {catData.subCategories?.map((sub) => {
            const slug = sub.href.split("/").pop();
            const isActive = slug === subcategory;
            return (
              <li key={sub.name}>
                <a
                  href={sub.href}
                  className={`flex items-center justify-between text-sm py-1.5 transition-colors group ${
                    isActive
                      ? "text-[#FF0036] font-semibold border-l-2 border-[#FF0036] pl-2"
                      : "text-gray-600 hover:text-[#FF0036] pl-0"
                  }`}
                >
                  <span>{sub.name}</span>
                  <ChevronRight size={12} className="text-gray-300 group-hover:text-[#FF0036]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Alt öğeler */}
      {subData && subData.items.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h3 className="font-bold text-sm text-gray-800 mb-3">{subData.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {subData.items.map((item) => (
              <a
                key={item}
                href={subData.href}
                className="text-xs text-gray-500 hover:text-[#FF0036] bg-gray-50 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

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
    </>
  );

  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</a>
          <ChevronRight size={12} />
          <a href={`/${category}`} className="hover:text-[#FF0036] transition-colors">
            {catData.name}
          </a>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">
            {subData?.name ?? subcategory}
          </span>
        </nav>

        <SidebarShell sidebar={sidebar}>
          {/* Başlık + Sıralama */}
          <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            <SlidersHorizontal size={15} className="text-gray-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
              {subData?.name ?? subcategory}
            </span>
            <span className="text-gray-300 flex-shrink-0">|</span>
            {["Önerilen", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Puan"].map((opt, i) => (
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
            ))}
            <span className="ml-auto text-xs text-gray-400 flex-shrink-0 pl-2">
              {products.length} ürün
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-base font-bold text-gray-700 mb-2">
                {subData?.name} için ürünler yakında
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                Bu alt kategoriye ait ürünler en kısa sürede eklenecek.
              </p>
              <a
                href={`/${category}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0036] text-white rounded-lg text-sm font-semibold hover:bg-[#CC0029] transition-colors"
              >
                {catData.name} sayfasına dön
              </a>
            </div>
          )}
        </SidebarShell>
      </div>
    </PageWrapper>
  );
}
