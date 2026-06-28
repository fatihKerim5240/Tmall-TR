"use client";
import { useState } from "react";
import { ChevronRight, Flame, Tag, Zap } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/data";
import { Category } from "@/types";

export function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative z-40">
      <div className="max-w-[1200px] mx-auto flex items-center">
        {/* Tüm Kategoriler Butonu */}
        <div
          className="relative group"
          onMouseEnter={() => setActiveCategory(NAV_CATEGORIES[0])}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <button className="flex items-center gap-2 bg-[#FF0036] text-white px-4 py-3 font-bold text-sm hover:bg-[#CC0029] transition-colors h-full">
            <span className="flex flex-col gap-0.5">
              <span className="w-4 h-0.5 bg-white block" />
              <span className="w-4 h-0.5 bg-white block" />
              <span className="w-4 h-0.5 bg-white block" />
            </span>
            Tüm Kategoriler
          </button>

          {/* Mega Dropdown */}
          {activeCategory && (
            <div className="absolute top-full left-0 bg-white shadow-2xl border border-gray-100 flex z-50 animate-slide-in"
              style={{ width: "760px" }}
            >
              {/* Sol: Kategori Listesi */}
              <div className="w-[200px] border-r border-gray-100 flex-shrink-0">
                {NAV_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                      activeCategory.id === cat.id
                        ? "bg-red-50 text-[#FF0036] font-semibold border-l-2 border-[#FF0036]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#FF0036]"
                    }`}
                    onMouseEnter={() => setActiveCategory(cat)}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                ))}
              </div>

              {/* Sağ: Alt Kategoriler */}
              <div className="flex-1 p-5">
                <h3 className="text-[#FF0036] font-bold text-sm mb-4 pb-2 border-b border-red-100">
                  {activeCategory.name}
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {activeCategory.subCategories?.map((sub) => (
                    <div key={sub.name}>
                      <a
                        href={sub.href}
                        className="font-semibold text-sm text-gray-800 hover:text-[#FF0036] block mb-1.5 transition-colors"
                      >
                        {sub.name}
                      </a>
                      <div className="flex flex-wrap gap-1">
                        {sub.items.map((item) => (
                          <a
                            key={item}
                            href="#"
                            className="text-xs text-gray-500 hover:text-[#FF0036] transition-colors"
                          >
                            {item}
                            {sub.items.indexOf(item) < sub.items.length - 1 && (
                              <span className="text-gray-300 ml-1">·</span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Featured Brands */}
                {activeCategory.featured && activeCategory.featured.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-2">ÖNE ÇIKAN MARKALAR</p>
                    <div className="flex gap-3">
                      {activeCategory.featured.map((brand) => (
                        <a
                          key={brand.name}
                          href={brand.href}
                          className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-700 hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                        >
                          {brand.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hızlı Nav Linkleri */}
        <div className="flex items-center overflow-x-auto no-scrollbar">
          <NavLink href="/flash" icon={<Zap size={13} className="text-[#FF0036]" />} label="Flash İndirim" hot />
          <NavLink href="/yeni" label="Yeni Gelenler" />
          <NavLink href="/markalar" label="Markalar" />
          <NavLink href="/super-indirim" icon={<Tag size={13} className="text-orange-500" />} label="Süper Fiyat" />
          <NavLink href="/cok-satanlar" icon={<Flame size={13} className="text-orange-500" />} label="Çok Satanlar" />
          <NavLink href="/kampanyalar" label="Kampanyalar" />
          <NavLink href="/premium" label="Premium" />
          <NavLink href="/diger" label="Diğer" />
        </div>

        {/* Sağ Taraf */}
        <div className="ml-auto flex-shrink-0 pl-4">
          <a href="/app-download" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#FF0036] transition-colors">
            <span className="text-base">📱</span>
            <span>Uygulamayı İndir</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  icon,
  hot,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  hot?: boolean;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-1 px-3.5 py-3 text-sm text-gray-700 hover:text-[#FF0036] transition-colors whitespace-nowrap relative group"
    >
      {icon}
      <span className={hot ? "font-semibold text-[#FF0036]" : ""}>{label}</span>
      {hot && (
        <span className="absolute top-1 right-1 text-[8px] bg-[#FF0036] text-white px-1 rounded-sm font-bold leading-tight">
          HOT
        </span>
      )}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FF0036] group-hover:w-full transition-all duration-200" />
    </a>
  );
}
