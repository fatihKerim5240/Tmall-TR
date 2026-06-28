import { ListingPage } from "@/components/shared/ListingPage";
import { getFlashProducts } from "@/lib/products";

export default function FlashPage() {
  const products = getFlashProducts();
  return (
    <ListingPage
      title="Flash İndirim"
      subtitle="Sınırlı süre, sınırlı stok — kaçırmadan kapıştır!"
      badge="⚡ ANLIK FIRSATLAR"
      bannerBg="linear-gradient(135deg, #FF0036 0%, #FF6600 100%)"
      bannerEmoji="⚡"
      breadcrumb={[{ label: "Flash İndirim" }]}
      products={products}
      sortOptions={["Önerilen", "En Yüksek İndirim", "En Çok Satan", "Fiyat: Düşükten Yükseğe"]}
    />
  );
}
