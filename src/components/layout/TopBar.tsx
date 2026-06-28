"use client";
import { ChevronDown } from "lucide-react";

const links = [
  "Tmall Hakkında",
  "Mağaza Aç",
  "Uygulamayı İndir",
  "Müşteri Hizmetleri",
];

export function TopBar() {
  return (
    <div className="bg-[#222] text-[#999] text-xs">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-8 px-0">
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="hover:text-white transition-colors cursor-pointer"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#ccc]">Merhaba,</span>
          <a href="/auth/login" className="hover:text-white text-[#FF0036] font-medium">
            Giriş Yap
          </a>
          <span>|</span>
          <a href="/auth/register" className="hover:text-white">
            Üye Ol
          </a>
          <span>|</span>
          <button className="flex items-center gap-1 hover:text-white">
            Türkçe <ChevronDown size={10} />
          </button>
          <span>|</span>
          <button className="flex items-center gap-1 hover:text-white">
            ₺ TRY <ChevronDown size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
