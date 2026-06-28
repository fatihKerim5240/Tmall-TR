"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronRight, CreditCard, Building2, Lock, MapPin, User, Phone } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { useCartStore } from "@/store/useCartStore";

type Step = 1 | 2 | 3 | 4;

const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Şanlıurfa", "Kocaeli"];

export default function OdemePage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const { items, clearCart } = useCartStore();

  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [address, setAddress] = useState({ city: "", district: "", street: "", zip: "" });
  const [payment, setPayment] = useState<"card" | "transfer">("card");
  const [card, setCard] = useState({ number: "", holder: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 750 ? 0 : 49;
  const total = subtotal + shipping;

  const handleOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setLoading(false);
    setOrdered(true);
  };

  if (!mounted) return null;

  const STEPS = ["İletişim", "Adres", "Ödeme", "Onay"];

  if (ordered) {
    return (
      <PageWrapper>
        <div className="max-w-[600px] mx-auto py-20 text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check size={44} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Siparişiniz Alındı!</h1>
          <p className="text-gray-500 text-sm mb-1">
            Sipariş numaranız: <span className="font-bold text-gray-700">#TMR{Date.now().toString().slice(-6)}</span>
          </p>
          <p className="text-gray-400 text-sm mb-8">
            {contact.email || contact.phone} adresine onay gönderildi.
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 text-left space-y-3">
            {[
              { icon: "📦", title: "Sipariş Hazırlanıyor", desc: "Ürünleriniz hazırlanıyor" },
              { icon: "🚚", title: "Kargoya Verilecek", desc: "1-2 iş günü içinde" },
              { icon: "🏠", title: "Teslimat", desc: "Adresinize teslim edilecek" },
            ].map((s) => (
              <div key={s.title} className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF0036] text-white font-bold rounded-xl hover:bg-[#CC0029] transition-colors">
            Alışverişe Devam Et
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-[1100px] mx-auto py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</Link>
          <ChevronRight size={12} />
          <Link href="/sepetim" className="hover:text-[#FF0036] transition-colors">Sepetim</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Ödeme</span>
        </nav>

        {/* Adım göstergesi */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => {
            const n = (i + 1) as Step;
            const done = step > n;
            const active = step === n;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${active ? "scale-105" : ""} transition-transform`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      done ? "bg-green-500 text-white" : active ? "bg-[#FF0036] text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {done ? <Check size={14} /> : n}
                  </div>
                  <span className={`text-sm font-medium ${active ? "text-[#FF0036]" : done ? "text-green-500" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-12 rounded ${step > n ? "bg-green-400" : "bg-gray-100"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-5 items-start">
          {/* Sol — Form */}
          <div className="flex-1 min-w-0">
            {/* ADIM 1 — İletişim */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User size={18} className="text-[#FF0036]" />
                  <h2 className="font-black text-gray-800">İletişim Bilgileri</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Ad Soyad *</label>
                      <input
                        value={contact.name}
                        onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                        placeholder="Ad Soyad"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Telefon *</label>
                      <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#FF0036]">
                        <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm text-gray-500 gap-1 whitespace-nowrap">
                          🇹🇷 +90
                        </span>
                        <input
                          value={contact.phone}
                          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                          placeholder="5xx xxx xx xx"
                          className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">E-posta</label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      placeholder="ornek@email.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036]"
                    />
                  </div>
                  <button
                    onClick={() => contact.name && contact.phone && setStep(2)}
                    disabled={!contact.name || !contact.phone}
                    className="w-full py-3.5 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Devam Et <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 2 — Adres */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={18} className="text-[#FF0036]" />
                  <h2 className="font-black text-gray-800">Teslimat Adresi</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">İl *</label>
                      <select
                        value={address.city}
                        onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036] bg-white"
                      >
                        <option value="">İl seçin</option>
                        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">İlçe *</label>
                      <input
                        value={address.district}
                        onChange={(e) => setAddress((a) => ({ ...a, district: e.target.value }))}
                        placeholder="İlçe"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Açık Adres *</label>
                    <textarea
                      value={address.street}
                      onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                      placeholder="Mahalle, sokak, bina no, daire no..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036] resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                      Geri
                    </button>
                    <button
                      onClick={() => address.city && address.district && address.street && setStep(3)}
                      disabled={!address.city || !address.district || !address.street}
                      className="flex-1 py-3 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      Devam Et <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADIM 3 — Ödeme */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={18} className="text-[#FF0036]" />
                  <h2 className="font-black text-gray-800">Ödeme Yöntemi</h2>
                  <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                    <Lock size={11} />
                    SSL Güvenli
                  </div>
                </div>

                {/* Yöntem seçimi */}
                <div className="flex gap-3 mb-5">
                  <button
                    onClick={() => setPayment("card")}
                    className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                      payment === "card" ? "border-[#FF0036] bg-red-50 text-[#FF0036]" : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <CreditCard size={16} /> Kredi / Banka Kartı
                  </button>
                  <button
                    onClick={() => setPayment("transfer")}
                    className={`flex-1 py-3 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                      payment === "transfer" ? "border-[#FF0036] bg-red-50 text-[#FF0036]" : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <Building2 size={16} /> Havale / EFT
                  </button>
                </div>

                {payment === "card" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Kart Numarası</label>
                      <input
                        value={card.number}
                        onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, "").slice(0, 16) }))}
                        placeholder="0000 0000 0000 0000"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036] font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1.5">Kart Sahibi</label>
                      <input
                        value={card.holder}
                        onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))}
                        placeholder="Ad Soyad"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5">Son Kullanma Tarihi</label>
                        <input
                          value={card.expiry}
                          onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                          placeholder="AA/YY"
                          maxLength={5}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5">CVV</label>
                        <input
                          value={card.cvv}
                          onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.slice(0, 4) }))}
                          placeholder="•••"
                          type="password"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-5 space-y-2 text-sm">
                    <p className="font-bold text-blue-700">Banka Bilgileri</p>
                    {[
                      { label: "Banka", value: "Tmall TR Bankası" },
                      { label: "IBAN", value: "TR00 0000 0000 0000 0000 0000 00" },
                      { label: "Hesap Adı", value: "Tmall TR Ticaret A.Ş." },
                      { label: "Açıklama", value: `SİPARİŞ-${Date.now().toString().slice(-6)}` },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between text-xs">
                        <span className="text-blue-600 font-medium">{r.label}</span>
                        <span className="text-blue-800 font-mono font-bold">{r.value}</span>
                      </div>
                    ))}
                    <p className="text-[11px] text-blue-500 pt-1">
                      Havale sonrası siparişiniz 1 iş günü içinde onaylanacaktır.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Geri
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 py-3 bg-[#FF0036] hover:bg-[#CC0029] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    İncele & Onayla <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 4 — Onay */}
            {step === 4 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-black text-gray-800">Siparişi Onayla</h2>

                {[
                  { title: "İletişim", content: `${contact.name} · ${contact.phone}${contact.email ? ` · ${contact.email}` : ""}`, onEdit: () => setStep(1) },
                  { title: "Adres", content: `${address.street}, ${address.district}, ${address.city}`, onEdit: () => setStep(2) },
                  { title: "Ödeme", content: payment === "card" ? `Kredi Kartı ···· ${card.number.slice(-4) || "****"}` : "Havale / EFT", onEdit: () => setStep(3) },
                ].map((row) => (
                  <div key={row.title} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-0.5">{row.title}</p>
                      <p className="text-sm text-gray-700">{row.content}</p>
                    </div>
                    <button onClick={row.onEdit} className="text-xs text-[#FF0036] hover:underline font-semibold">
                      Düzenle
                    </button>
                  </div>
                ))}

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full py-4 bg-[#FF0036] hover:bg-[#CC0029] disabled:opacity-60 text-white font-black text-base rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={16} />
                      Siparişi Onayla — {total.toLocaleString("tr-TR")}₺
                    </>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 text-center">
                  "Siparişi Onayla" butonuna tıklayarak Satış Sözleşmesi'ni kabul etmiş olursunuz.
                </p>
              </div>
            )}
          </div>

          {/* Sağ — Sipariş özeti */}
          <div className="w-72 flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">Sipariş Özeti</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-2.5 items-center">
                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0036] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-2">{item.product.name}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-800 flex-shrink-0">
                      {(item.product.price * item.quantity).toLocaleString("tr-TR")}₺
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Ara Toplam</span>
                  <span>{subtotal.toLocaleString("tr-TR")}₺</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Kargo</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? "Ücretsiz" : `${shipping}₺`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-gray-800 pt-1 border-t border-gray-100">
                  <span>Toplam</span>
                  <span className="text-[#FF0036] text-base">{total.toLocaleString("tr-TR")}₺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
