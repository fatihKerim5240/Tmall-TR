import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  id: string;
  type: "price_drop" | "campaign" | "order" | "system" | "favorite";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  productId?: string;
  emoji: string;
}

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "campaign",
    title: "Flash İndirim Başladı! ⚡",
    message: "Seçili ürünlerde %50'ye varan indirimler — sadece bugün!",
    timestamp: Date.now() - 1000 * 60 * 15,
    read: false,
    emoji: "⚡",
  },
  {
    id: "n2",
    type: "price_drop",
    title: "Fiyat Düştü!",
    message: "Sony WH-1000XM5 fiyatı 12.999₺'den 8.499₺'ye indi.",
    timestamp: Date.now() - 1000 * 60 * 60,
    read: false,
    productId: "e3",
    emoji: "📉",
  },
  {
    id: "n3",
    type: "campaign",
    title: "Hafta Sonu Kargo Kampanyası",
    message: "Bu hafta sonu tüm siparişlerde ücretsiz kargo!",
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    read: false,
    emoji: "🚚",
  },
  {
    id: "n4",
    type: "price_drop",
    title: "Fiyat Uyarısı",
    message: "Nike Air Max 270 fiyatı 4.299₺'den 2.499₺'ye indi!",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    productId: "s1",
    emoji: "👟",
  },
  {
    id: "n5",
    type: "system",
    title: "Hoş Geldiniz!",
    message: "Tmall TR'ye hoş geldiniz. İlk alışverişinizde %10 indirim kazanın.",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    read: true,
    emoji: "🎉",
  },
];

interface NotificationsStore {
  notifications: AppNotification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  push: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      notifications: SEED_NOTIFICATIONS,
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      push: (n) =>
        set((state) => ({
          notifications: [
            { ...n, id: `n${Date.now()}`, timestamp: Date.now(), read: false },
            ...state.notifications,
          ],
        })),
    }),
    { name: "tmall-notifications" }
  )
);
