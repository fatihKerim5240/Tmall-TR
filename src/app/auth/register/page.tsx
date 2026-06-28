"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Phone, Lock, ChevronRight, Check } from "lucide-react";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep(2);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setStep(3);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const strength = passwordStrength();
  const strengthColors = ["", "#FF0036", "#FF6600", "#FAAD14", "#52C41A"];
  const strengthLabels = ["", "Çok Zayıf", "Zayıf", "Orta", "Güçlü"];

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4 py-10">
      <div className="w-full max-w-[440px]">
        {/* İlerleme çubuğu */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {(["Telefon", "Doğrulama", "Şifre"] as const).map((label, i) => {
              const n = (i + 1) as Step;
              const done = step > n;
              const active = step === n;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      done
                        ? "bg-green-500 text-white"
                        : active
                        ? "bg-[#FF0036] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {done ? <Check size={14} /> : n}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-[#FF0036]" : done ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <div className={`h-0.5 w-8 mx-1 rounded ${step > n ? "bg-green-400" : "bg-gray-100"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Adım 1 — Telefon */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-1">Hesap Oluştur</h2>
              <p className="text-sm text-gray-400 mb-6">Telefon numaranı girerek başla</p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    Telefon Numarası
                  </label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#FF0036] transition-colors">
                    <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 gap-1 whitespace-nowrap">
                      🇹🇷 +90
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="5xx xxx xx xx"
                      className="flex-1 px-3 py-3 text-sm focus:outline-none"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Bu numaraya doğrulama kodu gönderilecek
                  </p>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-[#FF0036]" required />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    <a href="#" className="text-[#FF0036] hover:underline">Kullanıcı Sözleşmesi</a>
                    {" "}ve{" "}
                    <a href="#" className="text-[#FF0036] hover:underline">Gizlilik Politikası</a>
                    'nı okudum, kabul ediyorum.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Doğrulama Kodu Gönder <ChevronRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Adım 2 — OTP */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-1">Kodu Doğrula</h2>
              <p className="text-sm text-gray-400 mb-6">
                +90 {phone} numarasına gönderilen 6 haneli kodu gir
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-3">
                    Doğrulama Kodu
                  </label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg focus:border-[#FF0036] focus:outline-none transition-colors"
                        required
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Numarayı değiştir
                    </button>
                    <button type="button" className="text-xs text-[#FF0036] hover:underline">
                      Kodu tekrar gönder (59s)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.some((d) => !d)}
                  className="w-full py-3.5 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Kodu Doğrula <ChevronRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Adım 3 — Şifre */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-1">Şifreni Belirle</h2>
              <p className="text-sm text-gray-400 mb-6">
                Hesabın için güçlü bir şifre oluştur
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    Şifre
                  </label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#FF0036] transition-colors">
                    <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200">
                      <Lock size={15} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="En az 8 karakter"
                      className="flex-1 px-3 py-3 text-sm focus:outline-none"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 hover:bg-gray-50"
                    >
                      {showPassword ? <EyeOff size={15} className="text-gray-400" /> : <Eye size={15} className="text-gray-400" />}
                    </button>
                  </div>

                  {/* Güç göstergesi */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1.5 flex-1 rounded-full transition-all"
                            style={{ backgroundColor: i <= strength ? strengthColors[strength] : "#E5E7EB" }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px]" style={{ color: strengthColors[strength] }}>
                        {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                    Şifreyi Tekrarla
                  </label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:border-[#FF0036] transition-colors">
                    <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200">
                      <Lock size={15} className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Şifreyi tekrar gir"
                      className="flex-1 px-3 py-3 text-sm focus:outline-none"
                      required
                    />
                    {confirmPassword && (
                      <div className="flex items-center px-3">
                        {confirmPassword === password ? (
                          <Check size={15} className="text-green-500" />
                        ) : (
                          <span className="text-red-400 text-xs">✕</span>
                        )}
                      </div>
                    )}
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-[11px] text-red-400 mt-1">Şifreler eşleşmiyor</p>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1.5">Şifre gereksinimleri:</p>
                  {[
                    { label: "En az 8 karakter", ok: password.length >= 8 },
                    { label: "Büyük harf içermeli", ok: /[A-Z]/.test(password) },
                    { label: "Rakam içermeli", ok: /[0-9]/.test(password) },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5 text-xs">
                      <span className={r.ok ? "text-green-500" : "text-gray-400"}>
                        {r.ok ? "✓" : "○"}
                      </span>
                      <span className={r.ok ? "text-green-600" : "text-gray-500"}>{r.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || strength < 2 || password !== confirmPassword}
                  className="w-full py-3.5 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-60 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Hesabımı Oluştur <ChevronRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Zaten hesabın var mı?{" "}
            <Link href="/auth/login" className="text-[#FF0036] font-semibold hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
