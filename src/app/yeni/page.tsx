import { ListingPage } from "@/components/shared/ListingPage";
import { getNewArrivals } from "@/lib/products";

export default function YeniPage() {
  const products = getNewArrivals();
  return (
    <ListingPage
      title="Yeni Gelenler"
      subtitle="En taze ürünler, en güncel trendler"
      badge="🆕 YENİ ÜRÜNLER"
      bannerBg="linear-gradient(135deg, #13C2C2 0%, #1890FF 100%)"
      bannerEmoji="✨"
      breadcrumb={[{ label: "Yeni Gelenler" }]}
      products={products}
      sortOptions={["En Yeni", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Fiyat"]}
    />
  );
}
