"use client";
import { useState, useEffect } from "react";
import { Share2, X, Copy, Check } from "lucide-react";

interface Props {
  productName: string;
  price: number;
}

const PLATFORMS = [
  { name: "WhatsApp", emoji: "🟢", buildUrl: (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}` },
  { name: "Telegram", emoji: "✈️", buildUrl: (text: string, url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
  { name: "Twitter/X", emoji: "🐦", buildUrl: (text: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
  { name: "Facebook", emoji: "📘", buildUrl: (_: string, url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
];

export function ShareButton({ productName, price }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowModal(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  const shareText = `${productName} — ${price.toLocaleString("tr-TR")}₺`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: productName, text: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled or not supported — fall through to modal
      }
    }
    setShowModal(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-[#FF0036] transition-colors"
      >
        <Share2 size={12} />
        Ürünü Paylaş
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Ürünü Paylaş</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-400 mb-4 line-clamp-2">{productName}</p>

              <div className="grid grid-cols-4 gap-3 mb-5">
                {PLATFORMS.map((p) => (
                  <a
                    key={p.name}
                    href={p.buildUrl(shareText, shareUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-[10px] text-gray-500 text-center">{p.name}</span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <span className="text-xs text-gray-400 flex-1 truncate">{shareUrl || "tmall.com.tr/urun/..."}</span>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1 text-xs font-semibold text-[#FF0036] hover:underline flex-shrink-0 transition-colors"
                >
                  {copied ? (
                    <><Check size={12} className="text-green-500" /><span className="text-green-500">Kopyalandı!</span></>
                  ) : (
                    <><Copy size={12} /> Kopyala</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
