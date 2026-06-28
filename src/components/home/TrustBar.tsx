import { Shield, Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const ITEMS = [
  { icon: Shield, title: "Güvenli Alışveriş", desc: "SSL şifreli ödeme" },
  { icon: Truck, title: "Hızlı Kargo", desc: "Aynı gün / ertesi gün" },
  { icon: RotateCcw, title: "Kolay İade", desc: "30 gün ücretsiz iade" },
  { icon: CreditCard, title: "Taksit İmkânı", desc: "18 aya kadar taksit" },
  { icon: Headphones, title: "7/24 Destek", desc: "Her zaman yanınızdayız" },
];

export function TrustBar() {
  return (
    <div className="max-w-[1200px] mx-auto mb-4 px-4">
      <div className="bg-white rounded-lg px-2 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-gray-100">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-2.5 px-3 py-2 sm:py-0">
            <Icon size={20} className="text-[#FF0036] flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-800 leading-tight">{title}</p>
              <p className="text-[11px] text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
