import { ListingPage } from "@/components/shared/ListingPage";
import { ALL_PRODUCTS } from "@/lib/products";

export default function DigerPage() {
  // Stable "mixed" order — every other product to show variety across categories
  const products = ALL_PRODUCTS.filter((_, i) => i % 2 === 0)
    .concat(ALL_PRODUCTS.filter((_, i) => i % 2 !== 0));
  return (
    <ListingPage
      title="Keşfet"
      subtitle="Her kategoriden öne çıkan ürünler — sürprizlere hazır ol!"
      badge="🌟 KEŞFET"
      bannerBg="linear-gradient(135deg, #2D6A4F 0%, #1A1A2E 100%)"
      bannerEmoji="🌟"
      breadcrumb={[{ label: "Diğer" }]}
      products={products}
      sortOptions={["Önerilen", "En Çok Satan", "En Düşük Fiyat", "En Yüksek Puan"]}
    />
  );
}
