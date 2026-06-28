// Mock data types and generators for the PDP page.
// Uses a fixed reference timestamp so server/client output is identical (no hydration mismatch).

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpfulCount: number;
  verified: boolean;
  sellerName: string;
}

export interface QAItem {
  id: string;
  category: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answer: {
    content: string;
    answeredBy: string;
    date: string;
  };
}

// Fixed reference so generated dates are deterministic on both server and client.
const REF = 1767225600000; // 2026-01-01 00:00:00 UTC

const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

function pr(seed: string, i: number): number {
  let h = 0;
  for (let c = 0; c < seed.length; c++) h = ((h << 5) - h + seed.charCodeAt(c)) | 0;
  h = Math.abs(h);
  return ((h * (i + 1) * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const REVIEW_TEMPLATES: Record<number, Array<{ title: string; content: string }>> = {
  5: [
    { title: "Harika bir ürün, kesinlikle tavsiye ederim", content: "Beklentilerimin çok üzerinde çıktı. Kaliteli malzeme, sağlam yapı. Kargo da hızlıydı, 2 günde elime ulaştı. Fiyat/performans açısından gerçekten başarılı." },
    { title: "Çok memnun kaldım", content: "Daha önce de bu markadan almıştım, yine hayal kırıklığına uğramadım. Ürün açıklamadaki gibi, fotoğraflarla birebir uyuşuyor. Kesinlikle tekrar alırım." },
    { title: "Muhteşem kalite, pişman olmadım", content: "Bu fiyata bu kaliteyi bulmak gerçekten zor. Ürünü aldığımda kutusu bile çok etkileyiciydi. Uzun süre kullanacağımı düşünüyorum. Satıcıya da teşekkürler." },
    { title: "Mükemmel ürün!", content: "Uzun süre araştırdıktan sonra bu ürünü aldım ve hiç pişman olmadım. Kalitesi ve işçiliği gerçekten iyi. Herkese tavsiye ederim." },
    { title: "Ailecek beğendik", content: "Hediye olarak aldım, çok beğendiler. Kalitesi ve görünümü gerçekten güzel. Satıcı çok ilgiliydi, sorularımı hızla yanıtladı." },
  ],
  4: [
    { title: "Genel olarak memnunum", content: "Ürün iyi ama kargo biraz geç geldi. Ürünün kendisinden memnunum, bir sorun yok. Teslimat biraz daha hızlı olabilirdi." },
    { title: "İyi ürün, küçük eksikler var", content: "Ürün kaliteli ama kullanım kılavuzu yeterli değildi. Biraz araştırarak hallettim. Ürünün kendisi gayet iyi çalışıyor, memnunum." },
    { title: "Güzel ürün, fiyatını veriyor", content: "Beklediğimden biraz farklı geldi ama kalitesi iyi. Fiyatı da uygun sayılır. Genel olarak memnunum." },
  ],
  3: [
    { title: "İdare eder", content: "Ürün açıklamasındaki kadar iyi değil ama kullanılabilir. Fiyatını veriyor sayılır. Daha pahalı versiyonları daha iyi olabilir." },
    { title: "Ortalama", content: "Ne iyi ne kötü. Beklentilerimi tam karşılamadı ama kullanmaya devam ediyorum. Alternatiflerine de bakabilirsiniz." },
  ],
  2: [
    { title: "Beklediğimden kötü çıktı", content: "Ürün fotoğraflardaki kadar kaliteli değil. Satıcıya ulaştım, çözüm bulmaya çalışıyoruz. Şimdilik 2 yıldız." },
  ],
  1: [
    { title: "Hayal kırıklığı yarattı", content: "Beklentilerimi hiç karşılamadı. İade sürecindeyim. Satın almayı düşünenlere dikkatli olmalarını tavsiye ederim." },
  ],
};

const ANON_NAMES = [
  "A*** K.", "F*** Ö.", "M*** Y.", "A*** D.", "M*** Ç.",
  "Z*** A.", "A*** B.", "E*** S.", "İ*** T.", "H*** G.",
  "H*** K.", "M*** Y.", "Y*** Ö.", "S*** Ç.", "E*** D.",
  "E*** K.", "B*** Ş.", "L*** A.", "S*** T.", "B*** M.",
];

export function getRatingDist(rating: number, total: number): Record<number, number> {
  const r = rating;
  // Percentages always sum to 1.0 so 1★ stays realistic
  const [p5, p4, p3, p2, p1] =
    r >= 4.8 ? [0.72, 0.18, 0.05, 0.03, 0.02] :
    r >= 4.5 ? [0.60, 0.20, 0.10, 0.05, 0.05] :
    r >= 4.0 ? [0.45, 0.25, 0.18, 0.08, 0.04] :
               [0.30, 0.20, 0.20, 0.15, 0.15];
  const d: Record<number, number> = {
    5: Math.floor(total * p5),
    4: Math.floor(total * p4),
    3: Math.floor(total * p3),
    2: Math.floor(total * p2),
    1: Math.floor(total * p1),
  };
  // Add rounding remainder to the 5★ bucket
  d[5] += total - (d[5] + d[4] + d[3] + d[2] + d[1]);
  return d;
}

export function generateReviews(
  productId: string,
  shopName: string,
  rating: number,
  total: number
): Review[] {
  const dist = getRatingDist(rating, total);
  const reviews: Review[] = [];
  let idx = 0;

  for (const star of [5, 4, 3, 2, 1]) {
    const cnt = dist[star] ?? 0;
    const templates = REVIEW_TEMPLATES[star] ?? REVIEW_TEMPLATES[3];
    for (let i = 0; i < cnt && reviews.length < 8; i++, idx++) {
      const tIdx = Math.floor(pr(productId, idx * 3) * templates.length);
      const tpl = templates[tIdx];
      const nameIdx = Math.floor(pr(productId, idx * 7 + 1) * ANON_NAMES.length);
      const daysAgo = Math.floor(pr(productId, idx * 5 + 2) * 180) + 1;
      reviews.push({
        id: `rev-${productId}-${idx}`,
        author: ANON_NAMES[nameIdx],
        rating: star,
        title: tpl.title,
        content: tpl.content,
        date: formatDate(REF - daysAgo * 86400000),
        helpfulCount: Math.floor(pr(productId, idx * 11 + 3) * 80),
        verified: pr(productId, idx * 13 + 4) > 0.12,
        sellerName: shopName,
      });
    }
  }

  return reviews;
}

const QA_DATA = [
  { category: "Kargo & Teslimat", question: "Kargo süresi ne kadar?", answer: "Siparişiniz 1-3 iş günü içinde kargolanır. İstanbul içi genellikle ertesi gün, diğer iller için 2-3 iş günü içinde ulaşır." },
  { category: "Kargo & Teslimat", question: "Ücretsiz kargo var mı?", answer: "750₺ ve üzeri siparişlerde ücretsiz kargo uygulanmaktadır. Ürünümüz bu sınırın üzerinde olduğundan ücretsiz kargo geçerlidir." },
  { category: "Ürün Özellikleri", question: "Ürünün garantisi var mı?", answer: "Ürünümüz 2 yıl üretici garantisi kapsamındadır. Garanti belgesi ve servis bilgileri kutu içinde yer almaktadır." },
  { category: "Ürün Özellikleri", question: "Orijinal ürün mü?", answer: "Tüm ürünlerimiz %100 orijinaldir ve resmi distribütörlerden temin edilmektedir. Tmall TR güvencesiyle alışveriş yapabilirsiniz." },
  { category: "Kullanım & Bakım", question: "Türkçe kullanım kılavuzu var mı?", answer: "Evet, ürünümüzle birlikte Türkçe kullanım kılavuzu gelmektedir. Markamızın web sitesinden dijital versiyona da ulaşabilirsiniz." },
  { category: "Garanti & İade", question: "İade süresi ne kadar?", answer: "Ürün teslim tarihinden itibaren 30 gün içinde iade edebilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir." },
  { category: "Garanti & İade", question: "Arızalanırsa ne yapacağım?", answer: "Garanti kapsamındaki arızalar için müşteri hizmetlerimizle iletişime geçin. Yetkili servis yönlendirmesi veya ücretsiz değişim sağlanmaktadır." },
];

export function generateQAs(productId: string, shopName: string): QAItem[] {
  return QA_DATA.map((tpl, i) => {
    const daysAgo = Math.floor(pr(productId, i * 3 + 10) * 90) + 1;
    const nameIdx = Math.floor(pr(productId, i * 7 + 20) * ANON_NAMES.length);
    const answerDays = Math.floor(pr(productId, i * 5 + 30) * 2) + 1;
    return {
      id: `qa-${productId}-${i}`,
      category: tpl.category,
      question: tpl.question,
      askedBy: ANON_NAMES[nameIdx],
      askedDate: formatDate(REF - daysAgo * 86400000),
      answer: {
        content: tpl.answer,
        answeredBy: shopName,
        date: formatDate(REF - (daysAgo - answerDays) * 86400000),
      },
    };
  });
}

export const QA_COUNT = QA_DATA.length;
