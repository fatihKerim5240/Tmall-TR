import { ListingPage } from "@/components/shared/ListingPage";
import { getPremiumProducts } from "@/lib/products";

export default function PremiumPage() {
  const products = getPremiumProducts();
  return (
    <ListingPage
      title="Premium Koleksiyon"
      subtitle="Seçkin markalardan özenle küratörlenen lüks ürünler"
      badge="⭐ PREMIUM"
      bannerBg="linear-gradient(135deg, #1A1A2E 0%, #2D1B69 100%)"
      bannerEmoji="💎"
      breadcrumb={[{ label: "Premium" }]}
      products={products}
      sortOptions={["Önerilen", "En Yüksek Fiyat", "En Yüksek Puan", "En Çok Satan"]}
    />
  );
}
