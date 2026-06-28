"use client";
import { useState, useMemo } from "react";
import { Star, ThumbsUp, CheckCircle2, ChevronDown, Send } from "lucide-react";
import { generateReviews, getRatingDist, Review } from "@/lib/pdp-mock";

interface Props {
  productId: string;
  shopName: string;
  rating: number;
  ratingCount: number;
}

function StarRow({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? "fill-[#FAAD14] text-[#FAAD14]" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-right text-gray-600 font-medium">{star}</span>
      <Star size={10} className="fill-[#FAAD14] text-[#FAAD14] flex-shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FAAD14] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-gray-400">{count.toLocaleString("tr-TR")}</span>
    </div>
  );
}

function WriteReviewForm({ onClose }: { onClose: () => void }) {
  const [starHover, setStarHover] = useState(0);
  const [starSelected, setStarSelected] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!starSelected || !content.trim()) return;
    setSubmitted(true);
    setTimeout(onClose, 2500);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
        <p className="text-sm font-semibold text-gray-800">Yorumunuz alındı, teşekkürler!</p>
        <p className="text-xs text-gray-400 mt-1">Moderasyon sonrası yayınlanacaktır.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-1.5">Puanınız *</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setStarHover(i + 1)}
              onMouseLeave={() => setStarHover(0)}
              onClick={() => setStarSelected(i + 1)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                size={26}
                className={
                  i < (starHover || starSelected)
                    ? "fill-[#FAAD14] text-[#FAAD14]"
                    : "fill-gray-200 text-gray-200"
                }
              />
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        placeholder="Yorum başlığı (isteğe bağlı)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF0036] transition-colors"
      />
      <textarea
        placeholder="Ürün hakkındaki deneyiminizi paylaşın... *"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF0036] transition-colors resize-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={!starSelected || !content.trim()}
          className="flex-1 py-2 bg-[#FF0036] text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-[#CC0029] transition-colors flex items-center justify-center gap-1.5"
        >
          <Send size={13} /> Gönder
        </button>
      </div>
    </form>
  );
}

function ReviewCard({ rev, helpful, onHelpful }: { rev: Review; helpful: boolean; onHelpful: () => void }) {
  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF0036]/15 to-[#FF6600]/15 flex items-center justify-center text-sm font-bold text-[#FF0036] flex-shrink-0">
            {rev.author[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{rev.author}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <StarRow value={rev.rating} />
              {rev.verified && (
                <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-medium">
                  <CheckCircle2 size={10} /> Doğrulanmış Satın Alma
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-[11px] text-gray-400 flex-shrink-0">{rev.date}</span>
      </div>

      <h4 className="text-sm font-semibold text-gray-800 mb-1">{rev.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{rev.content}</p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={onHelpful}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
            helpful
              ? "border-[#FF0036] bg-red-50 text-[#FF0036] font-medium"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ThumbsUp size={11} />
          Faydalı ({(rev.helpfulCount + (helpful ? 1 : 0)).toLocaleString("tr-TR")})
        </button>
        <p className="text-[11px] text-gray-400">
          Satıcı: <span className="font-medium text-gray-600">{rev.sellerName}</span>
        </p>
      </div>
    </div>
  );
}

export function ReviewSection({ productId, shopName, rating, ratingCount }: Props) {
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const reviews = useMemo(
    () => generateReviews(productId, shopName, rating, ratingCount),
    [productId, shopName, rating, ratingCount]
  );
  const dist = useMemo(() => getRatingDist(rating, ratingCount), [rating, ratingCount]);
  const displayed = showAll ? reviews : reviews.slice(0, 4);

  return (
    <section id="reviews" className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header + overall rating */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
          <h2 className="font-black text-gray-800">Ürün Değerlendirmeleri</h2>
          <span className="text-sm text-gray-400">({ratingCount.toLocaleString("tr-TR")})</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 min-w-[140px]">
            <span className="text-5xl font-black text-[#FAAD14]">{rating.toFixed(1)}</span>
            <StarRow value={rating} size={16} />
            <span className="text-xs text-gray-400 mt-1.5">{ratingCount.toLocaleString("tr-TR")} değerlendirme</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map((s) => (
              <RatingBar key={s} star={s} count={dist[s] ?? 0} total={ratingCount} />
            ))}
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="divide-y divide-gray-50">
        {displayed.map((rev) => (
          <ReviewCard
            key={rev.id}
            rev={rev}
            helpful={!!helpfulMap[rev.id]}
            onHelpful={() => setHelpfulMap((m) => ({ ...m, [rev.id]: !m[rev.id] }))}
          />
        ))}
      </div>

      {reviews.length > 4 && (
        <div className="p-4 border-t border-gray-100 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 text-sm text-[#FF0036] font-semibold hover:underline"
          >
            <ChevronDown size={14} className={showAll ? "rotate-180 transition-transform" : "transition-transform"} />
            {showAll ? "Daha az göster" : `Tüm ${reviews.length} yorumu gör`}
          </button>
        </div>
      )}

      {/* Write review */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/50">
        {showForm ? (
          <WriteReviewForm onClose={() => setShowForm(false)} />
        ) : !isBuyer ? (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1.5">Yorum yazabilmek için bu ürünü satın almış olmanız gerekir.</p>
            <button
              onClick={() => setIsBuyer(true)}
              className="text-xs text-[#FF0036] hover:underline font-medium"
            >
              Zaten satın aldım, yorum yaz →
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-[#FF0036]/30 rounded-xl text-sm text-[#FF0036] font-semibold hover:border-[#FF0036]/60 hover:bg-red-50/40 transition-all"
          >
            + Yorum Yaz ve Puan Ver
          </button>
        )}
      </div>
    </section>
  );
}
