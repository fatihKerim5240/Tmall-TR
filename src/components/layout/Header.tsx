"use client";
import { useState, useRef } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  MapPin,
  Camera,
  Mic,
} from "lucide-react";

const HOT_SEARCHES = [
  "iPhone 15",
  "Nike Air Max",
  "Dyson Saç Kurutma",
  "AirPods Pro",
  "Zara Ceket",
  "PS5",
];

export function Header() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="bg-[#FF0036] sticky top-0 z-50 shadow-md">
      <div className="max-w-[1200px] mx-auto py-3 flex items-center gap-6">
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex flex-col items-center">
          <div className="bg-white rounded px-3 py-1">
            <span className="text-[#FF0036] font-black text-2xl tracking-tighter leading-none">
              Tmall
            </span>
            <span className="text-[#FF0036] text-[10px] font-bold block text-center -mt-1 tracking-widest">
              TR
            </span>
          </div>
        </a>

        {/* Konum */}
        <button className="flex-shrink-0 flex flex-col text-white/90 hover:text-white text-xs leading-tight">
          <MapPin size={14} className="mx-auto mb-0.5" />
          <span className="whitespace-nowrap">İstanbul</span>
        </button>

        {/* Arama */}
        <div className="flex-1 relative">
          <div
            className={`flex items-center bg-white rounded-sm overflow-hidden border-2 transition-all ${
              focused ? "border-[#FF6600]" : "border-transparent"
            }`}
          >
            {/* Kategori Seçici */}
            <select className="text-xs text-gray-500 border-r border-gray-200 px-2 py-0 h-10 bg-gray-50 focus:outline-none cursor-pointer pr-6 appearance-none">
              <option>Tüm Kategoriler</option>
              <option>Elektronik</option>
              <option>Giyim</option>
              <option>Ev & Yaşam</option>
              <option>Kozmetik</option>
              <option>Spor</option>
            </select>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Ürün, marka veya mağaza ara..."
              className="flex-1 h-10 px-3 text-sm focus:outline-none text-gray-800"
            />

            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Camera size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Mic size={16} />
            </button>

            <button className="h-10 px-5 bg-[#FF6600] hover:bg-[#E55A00] text-white font-bold text-sm transition-colors flex items-center gap-1.5">
              <Search size={16} />
              Ara
            </button>
          </div>

          {/* Popüler Aramalar */}
          {focused && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-100 z-50 animate-slide-in">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2 font-medium">POPÜLER ARAMALAR</p>
                <div className="flex flex-wrap gap-2">
                  {HOT_SEARCHES.map((term, i) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#FF0036] px-2 py-1 bg-gray-50 hover:bg-red-50 rounded transition-colors"
                    >
                      <span
                        className={`text-xs font-bold w-4 text-center ${
                          i === 0
                            ? "text-[#FF0036]"
                            : i === 1
                            ? "text-[#FF6600]"
                            : i === 2
                            ? "text-[#FAAD14]"
                            : "text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </span>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sağ İkonlar */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <NavIcon href="/hesabim" icon={<User size={20} />} label="Hesabım" />
          <NavIcon href="/favoriler" icon={<Heart size={20} />} label="Favoriler" />
          <NavIcon href="/bildirimler" icon={<Bell size={20} />} label="Bildirimler" />

          {/* Sepet */}
          <a
            href="/sepet"
            className="flex flex-col items-center text-white hover:text-white/80 transition-colors px-3 relative"
          >
            <div className="relative">
              <ShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-[#FAAD14] text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
                3
              </span>
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Sepetim</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function NavIcon({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center text-white hover:text-white/80 transition-colors px-2.5 py-1"
    >
      {icon}
      <span className="text-[10px] mt-0.5 whitespace-nowrap">{label}</span>
    </a>
  );
}
