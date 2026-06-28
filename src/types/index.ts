export interface Category {
  id: string;
  name: string;
  icon?: string;
  href: string;
  subCategories?: SubCategory[];
  featured?: FeaturedBrand[];
}

export interface SubCategory {
  name: string;
  href: string;
  items: string[];
}

export interface FeaturedBrand {
  name: string;
  logo: string;
  href: string;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  href: string;
  bgColor: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  shop: string;
  shopLogo?: string;
  sold?: number;
  rating?: number;
  isFlash?: boolean;
  flashEndTime?: string;
  badge?: string;
}

export interface FlashSale {
  endTime: string;
  products: Product[];
}
