import { ChevronRight, Store } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { BRANDS } from "@/lib/products";

const BRAND_CATEGORIES = [
  { label: "Elektronik", ids: ["apple", "samsung", "sony"] },
  { label: "Spor & Outdoor", ids: ["nike", "adidas"] },
  { label: "Moda & Giyim", ids: ["zara", "hm", "mango", "levis"] },
  { label: "Ev & Yaşam", ids: ["dyson", "philips", "delonghi"] },
  { label: "Güzellik & Kozmetik", ids: ["cerave", "dior"] },
  { label: "Anne & Bebek", ids: ["lego"] },
];

export default function BrandsPage() {
  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <a href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</a>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Tüm Markalar</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-gray-800">Öne Çıkan Markalar</h1>
          <span className="text-sm text-gray-400">{Object.keys(BRANDS).length} marka</span>
        </div>

        {BRAND_CATEGORIES.map((group) => {
          const groupBrands = group.ids.filter((id) => BRANDS[id]);
          if (groupBrands.length === 0) return null;
          return (
            <section key={group.label} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
                <h2 className="font-bold text-gray-800">{group.label}</h2>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {groupBrands.map((brandId) => {
                  const brand = BRANDS[brandId];
                  return (
                    <a
                      key={brandId}
                      href={`/brand/${brandId}`}
                      className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center gap-3 hover:border-[#FF0036] hover:shadow-md transition-all group"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-red-50 group-hover:to-orange-50 transition-all">
                        <Store size={22} className="text-gray-400 group-hover:text-[#FF0036] transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-800 group-hover:text-[#FF0036] transition-colors">
                          {brand.name}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* A-Z listesi */}
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Tüm Markalar — A'dan Z'ye</h2>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(BRANDS)
              .sort(([, a], [, b]) => a.name.localeCompare(b.name, "tr"))
              .map(([id, brand]) => (
                <a
                  key={id}
                  href={`/brand/${id}`}
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-[#FF0036] py-2 px-3 rounded-lg hover:bg-red-50 transition-colors group"
                >
                  <span>{brand.name}</span>
                  <ChevronRight size={12} className="text-gray-300 group-hover:text-[#FF0036]" />
                </a>
              ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
