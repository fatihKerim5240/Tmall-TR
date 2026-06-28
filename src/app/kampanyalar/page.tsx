import { ListingPage } from "@/components/shared/ListingPage";
import { getCampaignProducts } from "@/lib/products";

export default function KampanyalarPage() {
  const products = getCampaignProducts();
  return (
    <ListingPage
      title="Kampanyalar"
      subtitle="%20 ve üzeri indirimli özel kampanya ürünleri"
      badge="🎉 ÖZEL KAMPANYA"
      bannerBg="linear-gradient(135deg, #52C41A 0%, #13C2C2 100%)"
      bannerEmoji="🎉"
      breadcrumb={[{ label: "Kampanyalar" }]}
      products={products}
      sortOptions={["Önerilen", "En Yüksek İndirim", "En Çok Satan", "En Düşük Fiyat"]}
    />
  );
}
