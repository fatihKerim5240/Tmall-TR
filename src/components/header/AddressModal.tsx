"use client";
import { useState, useRef, useEffect } from "react";
import { MapPin, X, Plus, Home, Briefcase, Check, Trash2, ChevronDown } from "lucide-react";

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  icon: "home" | "office" | "other";
}

const TYPE_ICONS = {
  home: Home,
  office: Briefcase,
  other: MapPin,
} as const;

const TYPE_LABELS = { home: "Ev", office: "Ofis", other: "Diğer" } as const;

interface Props {
  addresses: Address[];
  selected: Address;
  onSelect: (a: Address) => void;
  onAddressesChange: (list: Address[]) => void;
}

export function AddressModal({ addresses, selected, onSelect, onAddressesChange }: Props) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [full, setFull] = useState("");
  const [iconType, setIconType] = useState<Address["icon"]>("other");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setShowForm(false); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const addAddress = () => {
    if (!label.trim() || !full.trim()) return;
    const newAddr: Address = { id: Date.now().toString(), label: label.trim(), fullAddress: full.trim(), icon: iconType };
    onAddressesChange([...addresses, newAddr]);
    onSelect(newAddr);
    setLabel(""); setFull(""); setIconType("other"); setShowForm(false); setOpen(false);
  };

  const deleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = addresses.filter((a) => a.id !== id);
    onAddressesChange(updated);
    if (selected.id === id && updated.length > 0) onSelect(updated[0]);
  };

  const SelIcon = TYPE_ICONS[selected.icon];

  return (
    <div ref={ref} className="hidden md:block relative flex-shrink-0">
      {/* Trigger */}
      <button
        onClick={() => { setOpen(!open); setShowForm(false); }}
        className="flex items-center gap-1.5 text-white/90 hover:text-white text-xs transition-colors"
      >
        <MapPin size={14} className="flex-shrink-0" />
        <div className="text-left">
          <p className="text-[10px] text-white/60 leading-none mb-0.5">Teslimat Adresi</p>
          <div className="flex items-center gap-0.5">
            <span className="font-semibold leading-none whitespace-nowrap max-w-[80px] truncate">
              {selected.label}
            </span>
            <ChevronDown size={11} className={`transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-[55] overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Teslimat Adresi Seç</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Address list */}
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

          {/* Add new */}
          <div className="border-t border-gray-100">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#FF0036] font-semibold hover:bg-red-50 transition-colors"
              >
                <Plus size={15} />
                Yeni Adres Ekle
              </button>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Yeni Adres</p>

                {/* Type picker */}
                <div className="flex gap-2">
                  {(["home", "office", "other"] as const).map((t) => {
                    const Ico = TYPE_ICONS[t];
                    return (
                      <button
                        key={t}
                        onClick={() => setIconType(t)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                          iconType === t
                            ? "border-[#FF0036] bg-red-50 text-[#FF0036]"
                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        <Ico size={14} />
                        {TYPE_LABELS[t]}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  placeholder="Etiket (örn: Ev, Yazlık)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Adres (İlçe, İl, Posta Kodu)"
                  value={full}
                  onChange={(e) => setFull(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAddress()}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF0036] transition-colors"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowForm(false); setLabel(""); setFull(""); }}
                    className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={addAddress}
                    disabled={!label.trim() || !full.trim()}
                    className="flex-1 py-2 bg-[#FF0036] text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-[#CC0029] transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
