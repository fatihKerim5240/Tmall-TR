"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  QrCode,
  ChevronRight,
  Shield,
  Check,
} from "lucide-react";

const QR_GRID = Array.from({ length: 21 }, (_, row) =>
  Array.from({ length: 21 }, (_, col) => {
    // Corner squares
    const isCorner =
      (row < 7 && col < 7) || (row < 7 && col > 13) || (row > 13 && col < 7);
    const isInnerCorner =
      (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
      (row >= 2 && row <= 4 && col >= 16 && col <= 18) ||
      (row >= 16 && row <= 18 && col >= 2 && col <= 4);
    if (isCorner) return isInnerCorner ? "filled" : row === 0 || row === 6 || col === 0 || col === 6 || (row > 13 && (row === 14 || row === 20 || col === 0 || col === 6)) || (col > 13 && (col === 14 || col === 20 || row === 0 || row === 6)) ? "border" : "empty";
    // Data pattern (pseudo-random but deterministic)
    const seed = (row * 21 + col) * 1234567;
    return ((seed >> 3) & 1) === 1 ? "filled" : "empty";
  })
);

function FakeQR() {
  return (
    <div className="w-48 h-48 mx-auto bg-white p-3 rounded-lg shadow-inner border border-gray-100">
      <div className="grid" style={{ gridTemplateColumns: "repeat(21, 1fr)", gap: "1px" }}>
        {Array.from({ length: 21 }, (_, row) =>
          Array.from({ length: 21 }, (_, col) => {
            const isTopLeft = row < 7 && col < 7;
            const isTopRight = row < 7 && col > 13;
            const isBottomLeft = row > 13 && col < 7;
            const isCornerBorder =
              (isTopLeft && (row === 0 || row === 6 || col === 0 || col === 6)) ||
              (isTopRight && (row === 0 || row === 6 || col === 14 || col === 20)) ||
              (isBottomLeft && (row === 14 || row === 20 || col === 0 || col === 6));
            const isCornerFill =
              (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
              (row >= 2 && row <= 4 && col >= 16 && col <= 18) ||
              (row >= 16 && row <= 18 && col >= 2 && col <= 4);
            const seed = (row * 31 + col) * 7 + row + col * 3;
            const isData = !isTopLeft && !isTopRight && !isBottomLeft && ((seed % 3) !== 0);
            const filled = isCornerBorder || isCornerFill || isData;
            return (
              <div
                key={`${row}-${col}`}
                className={`w-full aspect-square rounded-[1px] ${filled ? "bg-[#1A1A1A]" : "bg-white"}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [tab, setTab] = useState<"qr" | "password">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4 py-10">
      <div className="w-full max-w-[900px] flex gap-8 items-stretch">
        {/* Sol panel — tanıtım */}
        <div className="hidden lg:flex flex-col justify-between flex-1 bg-gradient-to-br from-[#FF0036] to-[#FF6600] rounded-2xl p-8 text-white">
          <div>
            <div className="bg-white/20 rounded-xl px-4 py-2 inline-block mb-6">
              <span className="font-black text-2xl tracking-tighter">Tmall</span>
              <span className="text-[10px] font-bold block text-center -mt-1 tracking-widest opacity-80">TR</span>
            </div>
            <h1 className="text-3xl font-black leading-tight mb-3">
              Türkiye'nin<br />Süper Alışveriş<br />Merkezi
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              Binlerce marka, milyonlarca ürün. Flash indirimler ve güvenli ödeme ile alışverişin keyfini çıkar.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Güvenli ödeme garantisi",
              "Hızlı teslimat seçenekleri",
              "Kolay iade & değişim",
              "7/24 müşteri desteği",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} />
                </div>
                {item}
              </div>
            ))}
          </div>

          <div className="text-white/50 text-xs">
            15 milyon+ mutlu alıcı
          </div>
        </div>

        {/* Sağ panel — giriş formu */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Sekme başlıkları */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setTab("password")}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                tab === "password"
                  ? "text-[#FF0036] border-b-2 border-[#FF0036]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Smartphone size={16} />
              Şifre ile Giriş
            </button>
            <button
              onClick={() => setTab("qr")}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                tab === "qr"
                  ? "text-[#FF0036] border-b-2 border-[#FF0036]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <QrCode size={16} />
              QR Kod ile Giriş
            </button>
          </div>

          <div className="p-8">
            {tab === "password" ? (
              <>
                <h2 className="text-xl font-black text-gray-800 mb-6">Hesabına Giriş Yap</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Telefon */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                      Telefon Numarası veya E-posta
                    </label>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#FF0036] transition-colors">
                      <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 gap-1">
                        🇹🇷 +90
                      </span>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="5xx xxx xx xx"
                        className="flex-1 px-3 py-3 text-sm focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Şifre */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-500">Şifre</label>
                      <a href="#" className="text-xs text-[#FF0036] hover:underline">
                        Şifremi Unuttum
                      </a>
                    </div>
                    <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#FF0036] transition-colors">
                      <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200">
                        <Lock size={15} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="flex-1 px-3 py-3 text-sm focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="px-3 hover:bg-gray-50 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={15} className="text-gray-400" />
                        ) : (
                          <Eye size={15} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sözleşme */}
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-[#FF0036]" required />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      <a href="#" className="text-[#FF0036] hover:underline">Kullanıcı Sözleşmesi</a>{" "}
                      ve{" "}
                      <a href="#" className="text-[#FF0036] hover:underline">Gizlilik Politikası</a>
                      'nı okudum ve kabul ediyorum.
                    </span>
                  </label>

                  {/* Giriş butonu */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Giriş Yap
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                {/* Ayırıcı */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">veya şununla devam et</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Sosyal giriş */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Google", emoji: "🇬" },
                    { label: "Apple", emoji: "🍎" },
                    { label: "Facebook", emoji: "📘" },
                  ].map((s) => (
                    <button
                      key={s.label}
                      className="py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-1.5"
                    >
                      <span>{s.emoji}</span>
                      {s.label}
                    </button>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                  Hesabın yok mu?{" "}
                  <Link href="/auth/register" className="text-[#FF0036] font-semibold hover:underline">
                    Ücretsiz Kayıt Ol
                  </Link>
                </p>
              </>
            ) : (
              /* QR Kod sekmesi */
              <div className="text-center">
                <h2 className="text-xl font-black text-gray-800 mb-2">QR Kod ile Giriş</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Tmall TR mobil uygulamasını aç ve QR kodu tarat
                </p>

                <div className="relative inline-block mb-6">
                  <div className={`transition-all duration-500 ${qrScanned ? "opacity-20 scale-95" : "opacity-100"}`}>
                    <FakeQR />
                  </div>
                  {qrScanned && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center animate-bounce">
                        <Check size={32} />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-0.5 bg-[#FF0036]/60 animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left space-y-3">
                  {[
                    "Tmall TR uygulamasını aç",
                    "Profil > QR ile Giriş'e dokun",
                    "Kamerayı QR koda yönelt",
                    "Onay ekranında doğrula",
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-[#FF0036] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setQrScanned(!qrScanned)}
                  className="text-xs text-[#FF0036] hover:underline"
                >
                  QR kodu yenile
                </button>

                <div className="flex items-center gap-2 mt-4 justify-center">
                  <Shield size={12} className="text-green-500" />
                  <span className="text-xs text-gray-400">Bu QR kod 5 dakika geçerlidir</span>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setTab("password")}
                    className="text-sm text-[#FF0036] font-medium hover:underline"
                  >
                    Şifre ile giriş yapmayı tercih ediyorum
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Güven rozeti */}
          <div className="px-8 pb-6 flex items-center justify-center gap-4">
            {[
              { icon: "🔒", text: "SSL Şifreleme" },
              { icon: "🛡️", text: "Veri Güvenliği" },
              { icon: "✅", text: "Doğrulanmış Site" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1 text-[10px] text-gray-400">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
