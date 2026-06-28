"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, ChevronRight, Check, CheckCheck } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";
import { useNotificationsStore, AppNotification } from "@/store/useNotificationsStore";

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  price_drop: "bg-blue-50 text-blue-600",
  campaign: "bg-red-50 text-[#FF0036]",
  order: "bg-green-50 text-green-600",
  system: "bg-purple-50 text-purple-600",
  favorite: "bg-pink-50 text-pink-600",
};

const TYPE_LABELS: Record<AppNotification["type"], string> = {
  price_drop: "Fiyat Düşüşü",
  campaign: "Kampanya",
  order: "Sipariş",
  system: "Sistem",
  favorite: "Favori",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dakika önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} saat önce`;
  const days = Math.floor(hrs / 24);
  return `${days} gün önce`;
}

type FilterTab = "all" | "unread" | "campaign" | "price_drop";

export default function BildirimlerPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { notifications, markRead, markAllRead } = useNotificationsStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "campaign") return n.type === "campaign";
    if (activeTab === "price_drop") return n.type === "price_drop";
    return true;
  });

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "Tümü", count: notifications.length },
    { key: "unread", label: "Okunmamış", count: unreadCount },
    { key: "campaign", label: "Kampanyalar" },
    { key: "price_drop", label: "Fiyat Düşüşleri" },
  ];

  return (
    <PageWrapper>
      <div className="max-w-[800px] mx-auto py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link href="/" className="hover:text-[#FF0036] transition-colors">Anasayfa</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 font-medium">Bildirimler</span>
        </nav>

        {/* Başlık */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-[#FF0036]" />
            <h1 className="text-xl font-black text-gray-800">Bildirimler</h1>
            {unreadCount > 0 && (
              <span className="bg-[#FF0036] text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} yeni
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#FF0036] transition-colors font-medium"
            >
              <CheckCheck size={14} />
              Tümünü okundu işaretle
            </button>
          )}
        </div>

        {/* Sekmeler */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-[#FF0036] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bildirim listesi */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
            <BellOff size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Bu kategoride bildirim bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`bg-white rounded-xl border px-4 py-4 flex gap-4 items-start cursor-pointer transition-all hover:shadow-sm ${
                  n.read
                    ? "border-gray-100 opacity-70"
                    : "border-[#FF0036]/20 shadow-sm"
                }`}
              >
                {/* Emoji / İkon */}
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                  {n.emoji}
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[n.type]}`}
                      >
                        {TYPE_LABELS[n.type]}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#FF0036] flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {timeAgo(n.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>

                  <div className="flex items-center gap-3 mt-2">
                    {n.productId && (
                      <Link
                        href={`/urun/${n.productId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-[#FF0036] font-semibold hover:underline"
                      >
                        Ürünü Gör →
                      </Link>
                    )}
                    {n.type === "campaign" && (
                      <Link
                        href="/kampanyalar"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-[#FF0036] font-semibold hover:underline"
                      >
                        Kampanyalar →
                      </Link>
                    )}
                    {n.read && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-400 ml-auto">
                        <Check size={11} />
                        Okundu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
