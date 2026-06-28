import { ListingPage } from "@/components/shared/ListingPage";
import { getTopDiscounts } from "@/lib/products";

export default function SuperIndirimPage() {
  const products = getTopDiscounts();
  return (
    <ListingPage
      title="Süper Fiyat"
      subtitle="En yüksek indirim oranlarıyla seçilmiş ürünler"
      badge="🏷️ SÜPER FİYAT"
      bannerBg="linear-gradient(135deg, #FF6600 0%, #FAAD14 100%)"
      bannerEmoji="🏷️"
      breadcrumb={[{ label: "Süper Fiyat" }]}
      products={products}
      sortOptions={["En Yüksek İndirim", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Puan"]}
    />
  );
}
