export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF0036]/5 via-white to-[#FF6600]/5">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-[#FF0036] rounded px-3 py-1">
              <span className="text-white font-black text-xl tracking-tighter leading-none">
                Tmall
              </span>
              <span className="text-white text-[9px] font-bold block text-center -mt-0.5 tracking-widest">
                TR
              </span>
            </div>
            <span className="text-gray-300 mx-2">|</span>
            <span className="text-gray-500 text-sm">Güvenli Giriş</span>
          </a>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="text-green-500">🔒</span>
            <span>SSL ile korumalı</span>
          </div>
        </div>
      </header>
      {children}
      <footer className="text-center text-xs text-gray-400 py-6">
        <div className="flex items-center justify-center gap-4 mb-2">
          {["Gizlilik Politikası", "Kullanım Koşulları", "Çerez Politikası", "Yardım Merkezi"].map((t) => (
            <a key={t} href="#" className="hover:text-[#FF0036] transition-colors">
              {t}
            </a>
          ))}
        </div>
        © 2025 Tmall TR. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
