"use client";
import { useState, useRef, useEffect } from "react";
import { MapPin, X, Plus, Home, Briefcase, Check, Trash2, ChevronDown, ArrowLeft } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Tip tanımları
───────────────────────────────────────────────────────────── */
export interface Address {
  id: string;
  label: string;
  fullAddress: string; // görüntüleme için kısa özet
  icon: "home" | "office" | "other";
  // Detaylı alanlar (sadece form ile eklenenler)
  il?: string;
  ilce?: string;
  mahalle?: string;
  postaKodu?: string;
  sokak?: string;
  binaNo?: string;
  daireNo?: string;
  acikAdres?: string;
}

interface FormState {
  il: string; ilce: string; mahalle: string; postaKodu: string;
  sokak: string; binaNo: string; daireNo: string; acikAdres: string;
}

const EMPTY_FORM: FormState = {
  il: "", ilce: "", mahalle: "", postaKodu: "",
  sokak: "", binaNo: "", daireNo: "", acikAdres: "",
};

const REQUIRED: (keyof FormState)[] = ["il", "ilce", "mahalle", "postaKodu", "sokak", "binaNo"];

const TYPE_ICONS = { home: Home, office: Briefcase, other: MapPin } as const;
const TYPE_LABELS = { home: "Ev", office: "Ofis", other: "Diğer" } as const;

/* ─────────────────────────────────────────────────────────────
   Yardımcı: form alanı
───────────────────────────────────────────────────────────── */
interface FieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  placeholder?: string;
  half?: boolean; // grid'de yarım genişlik mi?
}
function Field({ label, required, value, onChange, error, placeholder, half = true }: FieldProps) {
  return (
    <div className={half ? "" : "col-span-2"}>
      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500 placeholder:text-red-300"
            : "border-gray-200 focus:border-[#FF0036]"
        }`}
      />
      {error && (
        <p className="text-[10px] text-red-500 mt-0.5">Bu alan zorunludur</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Props
───────────────────────────────────────────────────────────── */
interface Props {
  addresses: Address[];
  selected: Address;
  onSelect: (a: Address) => void;
  onAddressesChange: (list: Address[]) => void;
}

/* ─────────────────────────────────────────────────────────────
   Bileşen
───────────────────────────────────────────────────────────── */
export function AddressModal({ addresses, selected, onSelect, onAddressesChange }: Props) {
  const [open, setOpen]           = useState(false);
  const [formOpen, setFormOpen]   = useState(false); // ayrı fixed modal
  const [iconType, setIconType]   = useState<Address["icon"]>("other");
  const [label, setLabel]         = useState("");
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [touched, setTouched]     = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  /* Dışarı tıklayınca dropdown kapansın */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  /* Escape: dropdown kapat */
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  /* Escape: form modal kapat */
  useEffect(() => {
    if (!formOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") closeForm(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [formOpen]);

  const openForm = () => {
    setOpen(false);
    setForm(EMPTY_FORM);
    setLabel("");
    setIconType("other");
    setTouched({});
    setSubmitted(false);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const setField = (key: keyof FormState) => (v: string) => {
    setForm((prev) => ({ ...prev, [key]: v }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const fieldError = (key: keyof FormState) =>
    REQUIRED.includes(key) && (touched[key] || submitted) && !form[key].trim();

  const isFormValid = () =>
    label.trim() !== "" &&
    REQUIRED.every((k) => form[k].trim() !== "");

  const saveAddress = () => {
    setSubmitted(true);
    if (!isFormValid()) return;

    const { il, ilce, mahalle, postaKodu, sokak, binaNo, daireNo, acikAdres } = form;
    const shortDisplay = `${sokak} No:${binaNo}${daireNo ? ` D:${daireNo}` : ""}, ${mahalle}, ${ilce}/${il} ${postaKodu}`.trim();

    const newAddr: Address = {
      id: Date.now().toString(),
      label: label.trim(),
      fullAddress: shortDisplay,
      icon: iconType,
      il, ilce, mahalle, postaKodu, sokak, binaNo, daireNo, acikAdres,
    };

    onAddressesChange([...addresses, newAddr]);
    onSelect(newAddr);
    closeForm();
  };

  const deleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter((a) => a.id !== id);
    onAddressesChange(updated);
    if (selected.id === id && updated.length > 0) onSelect(updated[0]);
  };

  return (
    <>
      {/* ─────────── Trigger + Dropdown ─────────── */}
      <div ref={dropRef} className="hidden md:block relative flex-shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs transition-colors"
        >
          <MapPin size={14} className="flex-shrink-0" />
          <div className="text-left">
            <p className="text-[10px] text-white/60 leading-none mb-0.5">Teslimat Adresi</p>
            <div className="flex items-center gap-0.5">
              <span className="font-semibold leading-none whitespace-nowrap max-w-[80px] truncate">
                {selected.label}
              </span>
              <ChevronDown
                size={11}
                className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </button>

        {open && (
          <div className="absolute top-[calc(100%+10px)] left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[55] overflow-hidden">
            {/* Başlık */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm">Teslimat Adresi Seç</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* Adres listesi */}
            <div className="max-h-56 overflow-y-auto">
              {addresses.map((addr) => {
                const AddrIcon = TYPE_ICONS[addr.icon];
                const isActive = selected.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => { onSelect(addr); setOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group ${
                      isActive ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive ? "bg-[#FF0036]/10" : "bg-gray-100 group-hover:bg-gray-200"
                    }`}>
                      <AddrIcon size={16} className={isActive ? "text-[#FF0036]" : "text-gray-500"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? "text-[#FF0036]" : "text-gray-800"}`}>
                        {addr.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{addr.fullAddress}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isActive && <Check size={14} className="text-[#FF0036]" />}
                      {addresses.length > 1 && (
                        <button
                          onClick={(e) => deleteAddress(addr.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1 rounded"
                          title="Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Yeni adres butonu */}
            <div className="border-t border-gray-100">
              <button
                onClick={openForm}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#FF0036] font-semibold hover:bg-red-50 transition-colors"
              >
                <Plus size={15} />
                Yeni Adres Ekle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────── Yeni Adres — Fixed Modal ─────────── */}
      {formOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal başlık */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <MapPin size={16} className="text-[#FF0036]" />
                Yeni Adres Ekle
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Kaydırılabilir form gövdesi */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

              {/* Adres tipi ve etiketi */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Adres Tipi</p>
                <div className="flex gap-2">
                  {(["home", "office", "other"] as const).map((t) => {
                    const Ico = TYPE_ICONS[t];
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setIconType(t)}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all ${
                          iconType === t
                            ? "border-[#FF0036] bg-red-50 text-[#FF0036]"
                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        <Ico size={16} />
                        {TYPE_LABELS[t]}
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Adres Etiketi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="örn: Ev, Yazlık, Annem"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${
                      submitted && !label.trim()
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-[#FF0036]"
                    }`}
                  />
                  {submitted && !label.trim() && (
                    <p className="text-[10px] text-red-500 mt-0.5">Bu alan zorunludur</p>
                  )}
                </div>
              </div>

              {/* Adres detayları — 2 sütunlu grid */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Adres Bilgileri</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="İl"          required value={form.il}         onChange={setField("il")}         error={fieldError("il")}         placeholder="İstanbul" />
                  <Field label="İlçe"        required value={form.ilce}       onChange={setField("ilce")}       error={fieldError("ilce")}       placeholder="Kadıköy" />
                  <Field label="Mahalle"     required value={form.mahalle}    onChange={setField("mahalle")}    error={fieldError("mahalle")}    placeholder="Moda Mah." />
                  <Field label="Posta Kodu"  required value={form.postaKodu}  onChange={setField("postaKodu")}  error={fieldError("postaKodu")}  placeholder="34710" />
                  <Field label="Sokak / Cadde" required value={form.sokak}    onChange={setField("sokak")}      error={fieldError("sokak")}      placeholder="Bahariye Cad." />
                  <Field label="Bina No"     required value={form.binaNo}     onChange={setField("binaNo")}     error={fieldError("binaNo")}     placeholder="12" />
                  <Field label="Daire No"             value={form.daireNo}    onChange={setField("daireNo")}                                     placeholder="3 (isteğe bağlı)" />
                  {/* Sağ hücre boş — sadece stil dengesi */}
                  <div />
                </div>
              </div>

              {/* Açık adres tarifi — tam genişlik */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Açık Adres Tarifi
                  <span className="text-gray-400 font-normal ml-1">(isteğe bağlı)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.acikAdres}
                  onChange={(e) => setField("acikAdres")(e.target.value)}
                  placeholder="Kapıcı kodu, bina girişi veya ek yönlendirme bilgisi..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF0036] transition-colors resize-none"
                />
              </div>

            </div>

            {/* Sabit alt butonlar */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={saveAddress}
                className="flex-1 py-2.5 bg-[#FF0036] text-white rounded-xl text-sm font-bold hover:bg-[#CC0029] transition-colors"
              >
                Adresi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
