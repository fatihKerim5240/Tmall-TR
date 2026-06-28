import { ListingPage } from "@/components/shared/ListingPage";
import { getBestSellers } from "@/lib/products";

export default function CokSatanlarPage() {
  const products = getBestSellers();
  return (
    <ListingPage
      title="Çok Satanlar"
      subtitle="Milyonlarca müşterinin tercih ettiği ürünler"
      badge="🔥 HAFTANIN EN ÇOK SATANLARI"
      bannerBg="linear-gradient(135deg, #722ED1 0%, #EB2F96 100%)"
      bannerEmoji="🔥"
      breadcrumb={[{ label: "Çok Satanlar" }]}
      products={products}
      sortOptions={["En Çok Satan", "En Yüksek Puan", "En Düşük Fiyat", "En Yüksek İndirim"]}
    />
  );
}
