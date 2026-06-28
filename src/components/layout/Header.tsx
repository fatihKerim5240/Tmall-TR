"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, User, Bell } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { AddressModal, type Address } from "@/components/header/AddressModal";
import { SearchBar } from "@/components/header/SearchBar";
import { VisualSearch } from "@/components/header/VisualSearch";
import { VoiceSearch } from "@/components/header/VoiceSearch";

const DEFAULT_ADDRESSES: Address[] = [
  { id: "a1", label: "İstanbul", fullAddress: "Kadıköy, İstanbul 34710", icon: "other" },
  { id: "a2", label: "Ev",       fullAddress: "Kadıköy, İstanbul 34710", icon: "home" },
  { id: "a3", label: "Ofis",     fullAddress: "Levent, İstanbul 34330",  icon: "office" },
];

export function Header() {
  const [query, setQuery] = useState("");
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address>(DEFAULT_ADDRESSES[0]);
  const [mounted, setMounted] = useState(false);

  const cartItems     = useCartStore((s) => s.items);
  const favItems      = useFavoritesStore((s) => s.items);
  const notifications = useNotificationsStore((s) => s.notifications);
  const router        = useRouter();

  useEffect(() => setMounted(true), []);

  const cartCount   = mounted ? cartItems.reduce((s, i) => s + i.quantity, 0) : 0;
  const favCount    = mounted ? favItems.length : 0;
  const unreadCount = mounted ? notifications.filter((n) => !n.read).length : 0;

  const handleSearch = (q: string) => {
    router.push(`/arama?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="bg-[#FF0036] sticky top-0 z-50 shadow-md">
      <div className="max-w-[1200px] mx-auto py-2.5 md:py-3 px-4 flex items-center gap-2 md:gap-4 lg:gap-5">

        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex flex-col items-center">
          <div className="bg-white rounded px-2.5 py-1 md:px-3">
            <span className="text-[#FF0036] font-black text-xl md:text-2xl tracking-tighter leading-none">Tmall</span>
            <span className="text-[#FF0036] text-[9px] md:text-[10px] font-bold block text-center -mt-1 tracking-widest">TR</span>
          </div>
        </a>

        {/* Adres seçici — masaüstünde görünür */}
        <AddressModal
          addresses={addresses}
          selected={selectedAddress}
          onSelect={setSelectedAddress}
          onAddressesChange={setAddresses}
        />

        {/* Akıllı arama çubuğu */}
        <SearchBar
          query={query}
          onChange={setQuery}
          onSearch={handleSearch}
          extraButtons={
            <>
              <VisualSearch />
              <VoiceSearch onResult={(text) => setQuery(text)} />
            </>
          }
        />

        {/* Sağ ikonlar */}
        <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">

          <a
            href="/auth/login"
            className="hidden md:flex flex-col items-center text-white hover:text-white/80 transition-colors px-2.5 py-1"
          >
            <User size={20} />
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Hesabım</span>
          </a>

          <Link
            href="/favorilerim"
            className="hidden md:flex flex-col items-center text-white hover:text-white/80 transition-colors px-2.5 py-1 relative"
          >
            <div className="relative">
              <Heart size={20} />
              {favCount > 0 && <Chip count={favCount} bg="bg-[#FAAD14] text-black" />}
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Favoriler</span>
          </Link>

          <Link
            href="/bildirimler"
            className="hidden sm:flex flex-col items-center text-white hover:text-white/80 transition-colors px-2 md:px-2.5 py-1 relative"
          >
            <div className="relative">
              <Bell size={20} />
              {unreadCount > 0 && <Chip count={unreadCount} bg="bg-[#FF6600] text-white" />}
            </div>
            <span className="hidden md:block text-[10px] mt-0.5 whitespace-nowrap">Bildirimler</span>
          </Link>

          <Link
            href="/sepetim"
            className="flex flex-col items-center text-white hover:text-white/80 transition-colors px-2 md:px-3 py-1 relative"
          >
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && <Chip count={cartCount} bg="bg-[#FAAD14] text-black" />}
            </div>
            <span className="hidden md:block text-[10px] mt-0.5 whitespace-nowrap">Sepetim</span>
          </Link>

        </div>
      </div>
    </header>
  );
}

function Chip({ count, bg }: { count: number; bg: string }) {
  return (
    <span className={`absolute -top-2 -right-2 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none ${bg}`}>
      {count > 99 ? "99+" : count > 9 ? "9+" : count}
    </span>
  );
}
