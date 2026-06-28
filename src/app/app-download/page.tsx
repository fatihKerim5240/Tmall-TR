import { PageWrapper } from "@/components/shared/PageWrapper";
import { ChevronRight, Star, Shield, Zap, Bell, Gift } from "lucide-react";

const FEATURES = [
  { icon: <Zap size={20} className="text-[#FF6600]" />, title: "Flash Bildirimler", desc: "Anlık indirim alarmları ve stok uyarıları" },
  { icon: <Star size={20} className="text-[#FAAD14]" />, title: "Özel Teklifler", desc: "Uygulama kullanıcılarına özel ekstra %10 indirim" },
  { icon: <Shield size={20} className="text-green-500" />, title: "Güvenli Ödeme", desc: "Face ID / Parmak izi ile tek dokunuşta ödeme" },
  { icon: <Bell size={20} className="text-[#1890FF]" />, title: "Sipariş Takibi", desc: "Kargonuzu anlık olarak takip edin" },
  { icon: <Gift size={20} className="text-[#EB2F96]" />, title: "Sadakat Puanları", desc: "Her alışverişte puan kazan, indirim olarak kullan" },
];

const RATINGS = [
  { store: "App Store", score: "4.8", count: "128K+" },
  { store: "Google Play", score: "4.7", count: "245K+" },
];

function FakeQR() {
  return (
    <div className="w-36 h-36 bg-white p-2.5 rounded-xl shadow-lg border border-gray-100">
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1A1A1A 0px, #1A1A1A 3px, transparent 3px, transparent 6px), repeating-linear-gradient(90deg, #1A1A1A 0px, #1A1A1A 3px, transparent 3px, transparent 6px)",
          backgroundSize: "6px 6px",
          opacity: 0.15,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-[#FF0036] rounded-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-black">TR</span>
        </div>
      </div>
    </div>
  );
}

export default function AppDownloadPage() {
  return (
    <PageWrapper>
      <div className="max-w-[1200px] mx-auto py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <a href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</a>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Uygulamayı İndir</span>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#FF0036] to-[#FF6600] rounded-2xl p-10 text-white mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute right-32 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative grid grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 border border-white/30">
                📱 MOBİL UYGULAMA
              </span>
              <h1 className="text-4xl font-black leading-tight mb-3">
                Tmall TR<br />Cepte!
              </h1>
              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
                Milyonlarca ürüne, özel uygulama fırsatlarına ve anlık bildirimlere her yerden ulaş.
              </p>

              <div className="flex items-center gap-4">
                {RATINGS.map((r) => (
                  <div key={r.store} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Star size={12} className="fill-white text-white" />
                      <span className="font-black text-lg">{r.score}</span>
                    </div>
                    <p className="text-white/70 text-[11px]">{r.store}</p>
                    <p className="text-white/50 text-[10px]">{r.count} değerlendirme</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <FakeQR />
              </div>
              <p className="text-white/70 text-xs text-center">
                QR kodu tarat veya mağazadan indir
              </p>

              <div className="flex gap-3">
                {/* App Store */}
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors border border-white/20">
                  <span className="text-xl">🍎</span>
                  <div className="text-left">
                    <p className="text-[9px] text-white/60 leading-none">Download on the</p>
                    <p className="text-sm font-bold leading-tight">App Store</p>
                  </div>
                </button>

                {/* Google Play */}
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl hover:bg-gray-900 transition-colors border border-white/20">
                  <span className="text-xl">▶️</span>
                  <div className="text-left">
                    <p className="text-[9px] text-white/60 leading-none">Get it on</p>
                    <p className="text-sm font-bold leading-tight">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Özellikler */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-black text-gray-800 text-center mb-8">
            Neden Tmall TR Uygulaması?
          </h2>
          <div className="grid grid-cols-5 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { value: "15M+", label: "Aktif Kullanıcı" },
            { value: "50M+", label: "Ürün Çeşidi" },
            { value: "4.8★", label: "Ortalama Puan" },
            { value: "%99.9", label: "Uptime Garantisi" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-[#FF0036] transition-colors"
            >
              <p className="text-2xl font-black text-[#FF0036] mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
