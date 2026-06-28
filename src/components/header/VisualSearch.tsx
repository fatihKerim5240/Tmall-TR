"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, Upload, ImageIcon, AlertCircle, Package, Search } from "lucide-react";

const MAX_MB = 2;
const MAX_BYTES = MAX_MB * 1024 * 1024;

type Phase =
  | { kind: "idle" }
  | { kind: "preview"; file: File; url: string }
  | { kind: "searching" }
  | { kind: "no_results" }
  | { kind: "error"; message: string };

function getIsMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}

export function VisualSearch() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const fileRef    = useRef<HTMLInputElement>(null);
  const cameraRef  = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setIsMobile(getIsMobile()); }, []);

  // Escape closes modal
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setPhase({ kind: "error", message: "Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, WEBP…)." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setPhase({ kind: "error", message: `Dosya boyutu ${MAX_MB}MB sınırını aşıyor (${(file.size / 1024 / 1024).toFixed(1)}MB).` });
      return;
    }
    const url = URL.createObjectURL(file);
    setPhase({ kind: "preview", file, url });
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = ""; // allow re-selecting same file
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const runSearch = useCallback(() => {
    setPhase({ kind: "searching" });
    // Mock: no real vision API, show "not found" after delay
    setTimeout(() => setPhase({ kind: "no_results" }), 1800);
  }, []);

  const reset = useCallback(() => {
    if (phase.kind === "preview") URL.revokeObjectURL(phase.url);
    setPhase({ kind: "idle" });
  }, [phase]);

  const closeModal = useCallback(() => {
    setOpen(false);
    if (phase.kind === "preview") URL.revokeObjectURL(phase.url);
    setPhase({ kind: "idle" });
  }, [phase]);

  const openModal = useCallback(() => { setOpen(true); setPhase({ kind: "idle" }); }, []);

  return (
    <>
      {/* Trigger inside the search bar */}
      <button
        onMouseDown={(e) => { e.preventDefault(); openModal(); }}
        title="Görselle ara"
        className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Camera size={16} />
      </button>

      {/* Hidden file inputs */}
      <input ref={fileRef}   type="file" accept="image/*"                     className="hidden" onChange={handleInput} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInput} />

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Camera size={16} className="text-[#FF0036]" />
                Görselle Ara
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">

              {/* ── IDLE ── */}
              {phase.kind === "idle" && (
                <div className="space-y-3">
                  {/* Drop zone */}
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#FF0036]/40 hover:bg-red-50/30 transition-all"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <Upload size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-600">Görsel yükle</p>
                    <p className="text-xs text-gray-400 mt-0.5">veya buraya sürükle bırak</p>
                    <p className="text-[11px] text-gray-300 mt-2">JPG · PNG · WEBP · Maks. {MAX_MB}MB</p>
                  </div>

                  {/* Platform buttons */}
                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => cameraRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                      >
                        <Camera size={15} /> Kamera
                      </button>
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                      >
                        <ImageIcon size={15} /> Galeri
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#FF0036] hover:text-[#FF0036] transition-colors"
                    >
                      <ImageIcon size={15} /> Dosya Seç
                    </button>
                  )}
                </div>
              )}

              {/* ── ERROR ── */}
              {phase.kind === "error" && (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle size={26} className="text-red-500" />
                  </div>
                  <p className="text-sm font-semibold text-red-600">{phase.message}</p>
                  <button onClick={reset} className="mt-1 text-xs text-[#FF0036] font-medium hover:underline">
                    Tekrar Dene
                  </button>
                </div>
              )}

              {/* ── PREVIEW ── */}
              {phase.kind === "preview" && (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img src={phase.url} alt="Seçilen görsel" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[11px] text-gray-400 text-center truncate px-2">{phase.file.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={reset}
                      className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Değiştir
                    </button>
                    <button
                      onClick={runSearch}
                      className="flex-1 py-2.5 bg-[#FF0036] text-white rounded-xl text-sm font-bold hover:bg-[#CC0029] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Search size={14} /> Ara
                    </button>
                  </div>
                </div>
              )}

              {/* ── SEARCHING ── */}
              {phase.kind === "searching" && (
                <div className="flex flex-col items-center gap-4 py-10">
                  <div className="w-12 h-12 rounded-full border-4 border-[#FF0036]/20 border-t-[#FF0036] animate-spin" />
                  <p className="text-sm text-gray-500">Benzer ürünler aranıyor…</p>
                </div>
              )}

              {/* ── NO RESULTS ── */}
              {phase.kind === "no_results" && (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package size={28} className="text-gray-300" />
                  </div>
                  <p className="text-base font-bold text-gray-700">Ürün bulunamadı</p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Üzgünüz, bu görsele uygun bir ürün bulamadık.
                    <br />Farklı bir görsel deneyin veya metin ile arama yapın.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-2 px-6 py-2.5 bg-[#FF0036] text-white rounded-xl text-sm font-bold hover:bg-[#CC0029] transition-colors"
                  >
                    Yeni Görsel Dene
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
