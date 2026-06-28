import { ChevronRight } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { ProductCard } from "@/components/shared/ProductCard";
import { Product } from "@/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ListingPageProps {
  title: string;
  subtitle?: string;
  badge?: string;
  bannerBg?: string;
  bannerEmoji?: string;
  breadcrumb?: BreadcrumbItem[];
  products: Product[];
  emptyMessage?: string;
  sortOptions?: string[];
}

export function ListingPage({
  title,
  subtitle,
  badge,
  bannerBg = "linear-gradient(135deg, #FF0036 0%, #FF6600 100%)",
  bannerEmoji,
  breadcrumb,
  products,
  emptyMessage = "Ürün bulunamadı.",
  sortOptions = ["Önerilen", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Fiyat", "En Yüksek Puan"],
}: ListingPageProps) {
  return (
    <PageWrapper>
      {/* Banner */}
      <div
        className="w-full py-10 text-center text-white mb-4"
        style={{ background: bannerBg }}
      >
        {bannerEmoji && (
          <div className="text-5xl mb-3">{bannerEmoji}</div>
        )}
        {badge && (
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/30">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-white/75 text-sm mt-1.5 max-w-md mx-auto">{subtitle}</p>
        )}
        <p className="text-white/50 text-xs mt-3">{products.length} ürün</p>
      </div>

      <div className="max-w-[1200px] mx-auto pb-10">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 px-1">
            <a href="/" className="hover:text-[#FF0036] transition-colors">
              Anasayfa
            </a>
            {breadcrumb.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <ChevronRight size={12} />
                {item.href ? (
                  <a href={item.href} className="hover:text-[#FF0036] transition-colors">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-gray-600 font-medium">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Sıralama çubuğu */}
        <div className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-500 mr-1 flex-shrink-0">Sırala:</span>
          {sortOptions.map((opt, i) => (
            <button
              key={opt}
              className={`text-sm px-3 py-1 rounded transition-colors whitespace-nowrap ${
                i === 0
                  ? "bg-[#FF0036] text-white"
                  : "text-gray-600 hover:text-[#FF0036] hover:bg-red-50"
              }`}
            >
              {opt}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
            {products.length} ürün bulundu
          </span>
        </div>

        {/* Ürün grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#FF0036] text-white text-sm font-semibold rounded-lg hover:bg-[#CC0029] transition-colors"
            >
              Anasayfaya Dön
            </a>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
