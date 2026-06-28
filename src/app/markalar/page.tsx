"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, Store, LayoutGrid } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { BRANDS, ALL_PRODUCTS } from "@/lib/products";
import { NAV_CATEGORIES } from "@/lib/data";

const CATEGORY_ICONS: Record<string, string> = {
  kadin: "👗",
  erkek: "👔",
  elektronik: "📱",
  "ev-yasam": "🏠",
  kozmetik: "💄",
  spor: "⚽",
  "anne-bebek": "🍼",
  gida: "🛒",
};

function BrandsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") ?? "all"
  );

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const url = catId === "all" ? "/markalar" : `/markalar?category=${catId}`;
    router.replace(url, { scroll: false });
  };

  const categoryBrandsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const product of ALL_PRODUCTS) {
      const { brand, category } = product;
      if (!brand || !category || !BRANDS[brand]) continue;
      if (!map[category]) map[category] = [];
      if (!map[category].includes(brand)) {
        map[category].push(brand);
      }
    }
    return map;
  }, []);

  const activeCategories = NAV_CATEGORIES.filter(
    (cat) => (categoryBrandsMap[cat.id]?.length ?? 0) > 0
  );

  const activeBrandIds = useMemo(() => {
    if (selectedCategory === "all") return Object.keys(BRANDS);
    return categoryBrandsMap[selectedCategory] ?? [];
  }, [selectedCategory, categoryBrandsMap]);

  const selectedCategoryData = NAV_CATEGORIES.find(
    (c) => c.id === selectedCategory
  );

  const productCountForBrand = (brandId: string) =>
    ALL_PRODUCTS.filter(
      (p) =>
        p.brand === brandId &&
        (selectedCategory === "all" || p.category === selectedCategory)
    ).length;

  const subCats = selectedCategoryData?.subCategories ?? [];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <a href="/" className="hover:text-[#FF0036] transition-colors">
            Anasayfa
          </a>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Tüm Markalar</span>
          {selectedCategory !== "all" && selectedCategoryData && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-600 font-medium">
                {selectedCategoryData.name}
              </span>
            </>
          )}
        </nav>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex gap-5 items-start relative">
          {/* ── Sol Sidebar ── */}
          <aside
            className={`fixed top-0 left-0 h-full w-72 bg-[#F5F5F5] z-50 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out
              md:static md:h-auto md:w-56 md:shrink-0 md:bg-transparent md:shadow-none md:z-auto md:translate-x-0 md:sticky md:top-4
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:hidden bg-white">
              <span className="font-bold text-sm text-gray-800">Kategoriler</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500">
                <ChevronRight size={18} className="rotate-180" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="font-bold text-xs uppercase tracking-wide text-gray-500">
                  Kategoriler
                </p>
              </div>

              <nav className="py-1">
                {/* Tüm Markalar */}
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all relative ${
                    selectedCategory === "all"
                      ? "text-[#FF0036] font-semibold bg-red-50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {selectedCategory === "all" && (
                    <span className="absolute left-0 top-0 h-full w-0.5 bg-[#FF0036] rounded-r" />
                  )}
                  <LayoutGrid
                    size={15}
                    className={
                      selectedCategory === "all"
                        ? "text-[#FF0036]"
                        : "text-gray-400"
                    }
                  />
                  <span className="flex-1 text-left">Tüm Markalar</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      selectedCategory === "all"
                        ? "bg-red-100 text-[#FF0036]"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {Object.keys(BRANDS).length}
                  </span>
                </button>

                {/* Kategoriler */}
                {activeCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count = categoryBrandsMap[cat.id]?.length ?? 0;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all relative border-t border-gray-50 ${
                        isActive
                          ? "text-[#FF0036] font-semibold bg-red-50"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-0.5 bg-[#FF0036] rounded-r" />
                      )}
                      <span className="text-base leading-none">
                        {CATEGORY_ICONS[cat.id] ?? "🏷️"}
                      </span>
                      <span className="flex-1 text-left">{cat.name}</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          isActive
                            ? "bg-red-100 text-[#FF0036]"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Alt bilgi kartı */}
            {selectedCategory !== "all" && selectedCategoryData && (
              <div className="mt-3 bg-gradient-to-br from-[#FF0036] to-[#FF4560] rounded-xl p-4 text-white">
                <p className="text-xs font-semibold opacity-80 mb-1">
                  Kategori
                </p>
                <p className="font-black text-base">
                  {selectedCategoryData.name}
                </p>
                <p className="text-xs opacity-70 mt-2">
                  {activeBrandIds.length} öne çıkan marka
                </p>
              </div>
            )}
          </aside>

          {/* ── Sağ İçerik ── */}
          <main className="flex-1 min-w-0 pb-20 md:pb-0">
            {/* Başlık */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <h1 className="text-xl font-black text-gray-800 leading-tight">
                  {selectedCategory === "all"
                    ? "Öne Çıkan Markalar"
                    : `${selectedCategoryData?.name} Markaları`}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {activeBrandIds.length} marka listeleniyor
                </p>
              </div>

              {selectedCategory !== "all" && selectedCategoryData && (
                <div className="flex gap-1.5 flex-wrap justify-end max-w-xs">
                  {subCats.slice(0, 4).map((sub) => (
                    <a
                      key={sub.href}
                      href={sub.href}
                      className="text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Öne Çıkan Markalar Grid */}
            {activeBrandIds.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {activeBrandIds.map((brandId) => {
                  const brand = BRANDS[brandId];
                  const count = productCountForBrand(brandId);
                  const href =
                    selectedCategory === "all"
                      ? `/brand/${brandId}`
                      : `/brand/${brandId}?category=${selectedCategory}`;

                  return (
                    <a
                      key={brandId}
                      href={href}
                      className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center gap-3 hover:border-[#FF0036] hover:shadow-lg transition-all group"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center group-hover:from-red-50 group-hover:to-orange-50 transition-all">
                        <Store
                          size={22}
                          className="text-gray-300 group-hover:text-[#FF0036] transition-colors"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#FF0036] transition-colors">
                          {brand.name}
                        </p>
                        {count > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {count} ürün
                          </p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center mb-6">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 text-sm">
                  Bu kategoride henüz kayıtlı marka bulunamadı.
                </p>
              </div>
            )}

            {/* A-Z Listesi — sadece "Tüm Markalar" görünümünde */}
            {selectedCategory === "all" && (
              <section className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-800 mb-4">
                  Tüm Markalar — A&apos;dan Z&apos;ye
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                  {Object.entries(BRANDS)
                    .sort(([, a], [, b]) => a.name.localeCompare(b.name, "tr"))
                    .map(([id, brand]) => (
                      <a
                        key={id}
                        href={`/brand/${id}`}
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-[#FF0036] py-2 px-3 rounded-lg hover:bg-red-50 transition-colors group"
                      >
                        <span>{brand.name}</span>
                        <ChevronRight
                          size={12}
                          className="text-gray-300 group-hover:text-[#FF0036]"
                        />
                      </a>
                    ))}
                </div>
              </section>
            )}

            {/* Kategori görünümünde: Alt kategori linkleri */}
            {selectedCategory !== "all" && selectedCategoryData && (
              <section className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-3 text-sm">
                  {selectedCategoryData.name} Alt Kategorileri
                </h2>
                <div className="grid grid-cols-2 gap-1">
                  {subCats.map((sub) => (
                    <a
                      key={sub.href}
                      href={sub.href}
                      className="flex items-center justify-between text-sm text-gray-600 hover:text-[#FF0036] py-2 px-3 rounded-lg hover:bg-red-50 transition-colors group"
                    >
                      <span>{sub.name}</span>
                      <ChevronRight
                        size={12}
                        className="text-gray-300 group-hover:text-[#FF0036]"
                      />
                    </a>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>

        {/* Floating filter button — mobile only */}
        <button
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#FF0036] text-white px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm"
          onClick={() => setSidebarOpen(true)}
        >
          <LayoutGrid size={14} />
          Kategoriler
        </button>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <PageWrapper>
      <Suspense fallback={<div className="max-w-[1200px] mx-auto py-6 h-96" />}>
        <BrandsContent />
      </Suspense>
    </PageWrapper>
  );
}
