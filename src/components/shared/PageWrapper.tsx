import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { MegaMenu } from "@/components/layout/MegaMenu";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <TopBar />
      <Header />
      <MegaMenu />
      <main>{children}</main>
      <footer className="bg-[#222] text-gray-400 text-xs mt-8">
        <div className="max-w-[1200px] mx-auto py-8 md:py-10 px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {["Tmall Hakkında", "Alıcı Hizmetleri", "Satıcı Hizmetleri", "Ödeme & Güvenlik", "İletişim"].map(
            (title) => (
              <div key={title}>
                <h4 className="text-white font-bold mb-3 text-sm">{title}</h4>
                {Array.from({ length: 4 }).map((_, i) => (
                  <p key={i} className="mb-1.5">
                    <a href="#" className="hover:text-white transition-colors">
                      Alt Bağlantı {i + 1}
                    </a>
                  </p>
                ))}
              </div>
            )
          )}
        </div>
        <div className="border-t border-gray-700 py-4 text-center text-gray-500 px-4">
          © 2025 Tmall TR. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
