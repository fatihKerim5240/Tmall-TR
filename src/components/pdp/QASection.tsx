"use client";
import { useState, useMemo } from "react";
import { Store, MessageCircle, ChevronDown, Send, CheckCircle2 } from "lucide-react";
import { generateQAs, QAItem } from "@/lib/pdp-mock";

interface Props {
  productId: string;
  shopName: string;
}

const CATEGORIES = ["Tümü", "Kargo & Teslimat", "Ürün Özellikleri", "Kullanım & Bakım", "Garanti & İade"];

function QACard({ qa }: { qa: QAItem }) {
  return (
    <div className="p-5">
      <div className="flex gap-3">
        <MessageCircle size={15} className="text-[#FF0036] mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-800">{qa.question}</p>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{qa.askedDate}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] text-gray-400">Soran: <span className="font-medium text-gray-600">{qa.askedBy}</span></span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500">{qa.category}</span>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Store size={12} className="text-[#FF0036]" />
              <span className="text-[11px] font-bold text-[#FF0036]">{qa.answer.answeredBy}</span>
              <span className="text-[10px] text-gray-400">· {qa.answer.date}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{qa.answer.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QASection({ productId, shopName }: Props) {
  const [activeCat, setActiveCat] = useState("Tümü");
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const qas = useMemo(() => generateQAs(productId, shopName), [productId, shopName]);
  const filtered = activeCat === "Tümü" ? qas : qas.filter((q) => q.category === activeCat);
  const displayed = showAll ? filtered : filtered.slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setSubmitted(true);
    setQuestion("");
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
  };

  return (
    <section id="qa" className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-[#FF0036] rounded-full block" />
          <h2 className="font-black text-gray-800">Ürün Soru ve Cevapları</h2>
          <span className="text-sm text-gray-400">({qas.length})</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCat(cat); setShowAll(false); }}
              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                activeCat === cat
                  ? "bg-[#FF0036] border-[#FF0036] text-white font-semibold"
                  : "border-gray-200 text-gray-500 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {displayed.map((qa) => (
          <QACard key={qa.id} qa={qa} />
        ))}
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">Bu kategoride henüz soru bulunmuyor.</p>
        )}
      </div>

      {filtered.length > 3 && (
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1.5 text-sm text-[#FF0036] font-semibold hover:underline"
          >
            <ChevronDown size={14} className={showAll ? "rotate-180 transition-transform" : "transition-transform"} />
            {showAll ? "Daha az göster" : `Tüm ${filtered.length} soruyu gör`}
          </button>
        </div>
      )}

      {/* Ask a question */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/50">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 font-medium hover:border-[#FF0036]/40 hover:text-[#FF0036] hover:bg-red-50/30 transition-all"
          >
            + Soru Sor
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            {submitted ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium py-2">
                <CheckCircle2 size={16} />
                Sorunuz alındı! Satıcı en kısa sürede yanıtlayacak.
              </div>
            ) : (
              <>
                <textarea
                  autoFocus
                  placeholder="Ürün hakkında merak ettiğiniz bir şey var mı?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF0036] transition-colors resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={!question.trim()}
                    className="flex-1 py-2 bg-[#FF0036] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 hover:bg-[#CC0029] transition-colors"
                  >
                    <Send size={13} /> Gönder
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
