import { PageWrapper } from "@/components/shared/PageWrapper";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { CategoryBanners } from "@/components/home/CategoryBanners";
import { FeaturedSection } from "@/components/home/FeaturedSection";

export default function HomePage() {
  return (
    <PageWrapper>
      <HeroSection />
      <TrustBar />
      <FlashSaleSection />
      <CategoryBanners />
      <FeaturedSection />
    </PageWrapper>
  );
}
