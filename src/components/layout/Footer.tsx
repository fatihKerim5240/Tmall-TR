import Link from "next/link";
import { Shield, Lock, BadgeCheck } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Veri
───────────────────────────────────────────────────────────── */
const LINK_COLS = [
  {
    title: "Tmall Hakkında",
    links: [
      { label: "Hakkımızda", href: "#" },
      { label: "Basın Odası", href: "#" },
      { label: "Kariyer", href: "#" },
      { label: "Sürdürülebilirlik", href: "#" },
      { label: "Yatırımcı İlişkileri", href: "#" },
    ],
  },
  {
    title: "Kampanyalar",
    links: [
      { label: "Flash İndirimler", href: "/flash" },
      { label: "Süper Fiyatlar", href: "/super-indirim" },
      { label: "Günün Fırsatları", href: "/kampanyalar" },
      { label: "Premium Üyelik", href: "/premium" },
      { label: "Kupon Kullan", href: "#" },
    ],
  },
  {
    title: "Satıcı Hizmetleri",
    links: [
      { label: "Mağaza Aç", href: "#" },
      { label: "Satıcı Merkezi", href: "#" },
      { label: "Reklam Çözümleri", href: "#" },
      { label: "Lojistik Desteği", href: "#" },
      { label: "Satıcı Akademisi", href: "#" },
    ],
  },
  {
    title: "Yardım",
    links: [
      { label: "Sık Sorulan Sorular", href: "#" },
      { label: "İade ve İptal", href: "#" },
      { label: "Kargo Takibi", href: "#" },
      { label: "Müşteri Hizmetleri", href: "#" },
      { label: "Canlı Destek", href: "#" },
    ],
  },
];

const LEGAL = [
  { label: "Çerez Tercihleri", href: "#" },
  { label: "Kullanım Koşulları", href: "#" },
  { label: "Kişisel Verilerin Korunması", href: "#" },
  { label: "Aydınlatma Metni", href: "#" },
  { label: "Mesafeli Satış Sözleşmesi", href: "#" },
];

/* ─────────────────────────────────────────────────────────────
   SVG ikonları — sosyal medya
───────────────────────────────────────────────────────────── */
const IgSvg = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const TikTokSvg = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.17a8.17 8.17 0 0 0 4.77 1.51V7.24a4.85 4.85 0 0 1-1-.55z" />
  </svg>
);

const YouTubeSvg = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const FacebookSvg = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XSvg = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SVG ikonları — ödeme yöntemleri
───────────────────────────────────────────────────────────── */
const MastercardSvg = () => (
  <svg viewBox="0 0 50 32" width="50" height="32">
    <rect width="50" height="32" rx="4" fill="white" stroke="#E5E7EB" />
    <circle cx="19" cy="16" r="8" fill="#EB001B" />
    <circle cx="31" cy="16" r="8" fill="#F79E1B" />
    <path d="M25 9.5a8 8 0 0 1 0 13A8 8 0 0 1 25 9.5z" fill="#FF5F00" />
  </svg>
);

const VisaSvg = () => (
  <svg viewBox="0 0 54 32" width="54" height="32">
    <rect width="54" height="32" rx="4" fill="white" stroke="#E5E7EB" />
    <text x="6" y="22" fontSize="17" fontWeight="800" fill="#1434CB" fontFamily="Arial, sans-serif" letterSpacing="-0.5">VISA</text>
  </svg>
);

const TroySvg = () => (
  <svg viewBox="0 0 54 32" width="54" height="32">
    <rect width="54" height="32" rx="4" fill="white" stroke="#E5E7EB" />
    <text x="6" y="21" fontSize="14" fontWeight="700" fill="#003087" fontFamily="Arial, sans-serif">troy</text>
    <circle cx="41" cy="16" r="5" fill="#E31E2D" />
    <circle cx="47" cy="16" r="5" fill="#003087" fillOpacity="0.85" />
  </svg>
);

const AmexSvg = () => (
  <svg viewBox="0 0 54 32" width="54" height="32">
    <rect width="54" height="32" rx="4" fill="#016FD0" />
    <text x="5" y="21" fontSize="12" fontWeight="700" fill="white" fontFamily="Arial, sans-serif" letterSpacing="0.5">AMEX</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SVG ikonları — uygulama mağazaları
───────────────────────────────────────────────────────────── */
const AppleSvg = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlaySvg = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path d="M3.18 23.76A2 2 0 0 1 2 22V2a2 2 0 0 1 1.18-1.76l12 10.76-12 12.76z" fill="#EA4335" />
    <path d="M20.82 10.24 17.27 8 14.18 11 17.27 14 20.82 13.76A2 2 0 0 0 20.82 10.24z" fill="#FBBC05" />
    <path d="M3.18.24 14.18 11 17.27 8 5.73.78A2 2 0 0 0 3.18.24z" fill="#4285F4" />
    <path d="M3.18 23.76A2 2 0 0 0 5.73 23.22L17.27 16 14.18 13 3.18 23.76z" fill="#34A853" />
  </svg>
);

const HuaweiSvg = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
    <path d="M12 2C7 2 3.5 5.5 2 9c2.5-1 5-1.2 7.5-.5C6.5 10.5 4.5 13 4.5 16c0 1.5.4 3 1.2 4.2C7.5 22 9.7 22.5 12 22.5s4.5-.5 6.3-2.3c.8-1.2 1.2-2.7 1.2-4.2 0-3-2-5.5-5-7.5 2.5-.7 5-.5 7.5.5C20.5 5.5 17 2 12 2z" fill="#CF0A2C" />
    <ellipse cx="12" cy="12" rx="3" ry="4" fill="white" fillOpacity="0.3" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Küçük yardımcı bileşenler
───────────────────────────────────────────────────────────── */
function SocialBtn({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-white hover:text-white transition-all"
    >
      {children}
    </a>
  );
}

function AppBtn({
  href, topLine, bottomLine, icon,
}: {
  href: string; topLine: string; bottomLine: string; icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-4 py-2.5 transition-colors min-w-[136px]"
    >
      <span className="flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] text-zinc-400 leading-none">{topLine}</p>
        <p className="text-[13px] font-semibold text-white leading-tight mt-0.5">{bottomLine}</p>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   Ana Footer
───────────────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="mt-10">

      {/* ── ÜST BÖLÜM — link kolonları + güvenli alışveriş ── */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto py-10 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 xl:gap-10">

            {/* 4 link kolonu */}
            {LINK_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-gray-800 mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-xs text-gray-500 hover:text-[#FF0036] transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 5. kolon — ödeme & sertifikalar */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">

              {/* Ödeme yöntemleri */}
              <h4 className="text-sm font-bold text-gray-800 mb-3">Güvenli Alışveriş</h4>
              <div className="flex flex-wrap gap-2">
                <MastercardSvg />
                <VisaSvg />
                <TroySvg />
                <AmexSvg />
              </div>

              {/* Güven damgaları */}
              <h4 className="text-sm font-bold text-gray-800 mt-5 mb-3">Güvenlik Sertifikaları</h4>
              <div className="flex flex-wrap gap-2">

                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-2">
                  <BadgeCheck size={14} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-green-700 leading-none">ETBİS</p>
                    <p className="text-[9px] text-gray-400 leading-none mt-0.5">Kayıtlı Üye</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-2">
                  <Shield size={14} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-blue-700 leading-none">PCI DSS</p>
                    <p className="text-[9px] text-gray-400 leading-none mt-0.5">Level 1</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-2">
                  <Lock size={14} className="text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-700 leading-none">256-bit</p>
                    <p className="text-[9px] text-gray-400 leading-none mt-0.5">SSL Güvenli</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALT BÖLÜM — koyu arka plan ── */}
      <div className="bg-zinc-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4">

          {/* Sosyal medya + uygulama indirme */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-5 border-b border-zinc-800">

            {/* Sosyal medya */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 mr-1">Bizi takip edin:</span>
              <SocialBtn label="Instagram" href="#">
                <IgSvg />
              </SocialBtn>
              <SocialBtn label="TikTok" href="#">
                <TikTokSvg />
              </SocialBtn>
              <SocialBtn label="YouTube" href="#">
                <YouTubeSvg />
              </SocialBtn>
              <SocialBtn label="Facebook" href="#">
                <FacebookSvg />
              </SocialBtn>
              <SocialBtn label="X" href="#">
                <XSvg />
              </SocialBtn>
            </div>

            {/* Uygulama indirme butonları */}
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-end">
              <AppBtn href="#" topLine="App Store'dan" bottomLine="İndir" icon={<AppleSvg />} />
              <AppBtn href="#" topLine="Google Play'den" bottomLine="İndir" icon={<GooglePlaySvg />} />
              <AppBtn href="#" topLine="AppGallery'den" bottomLine="İndir" icon={<HuaweiSvg />} />
            </div>
          </div>

          {/* Telif hakkı + yasal linkler */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
            <p>© 2026 Tmall TR. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {LEGAL.map((l, i) => (
                <span key={l.label} className="flex items-center gap-3">
                  <Link href={l.href} className="hover:text-zinc-300 transition-colors whitespace-nowrap">
                    {l.label}
                  </Link>
                  {i < LEGAL.length - 1 && <span className="text-zinc-700">·</span>}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
