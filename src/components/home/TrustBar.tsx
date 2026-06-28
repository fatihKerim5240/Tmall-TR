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
    <div className="max-w-[1200px] mx-auto mb-4">
      <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between divide-x divide-gray-100">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-2.5 px-4 flex-1">
            <Icon size={22} className="text-[#FF0036] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800 leading-tight">{title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
