import Image from "next/image";

const BANNERS = [
  {
    id: "b1",
    title: "Elektronik Festivali",
    subtitle: "%40'a varan indirim",
    image: "https://picsum.photos/seed/elekfest/400/200",
    href: "/elektronik",
    accent: "#1A1A2E",
  },
  {
    id: "b2",
    title: "Moda Haftası",
    subtitle: "Yeni sezon, yeni fırsatlar",
    image: "https://picsum.photos/seed/modahaft/400/200",
    href: "/kadin",
    accent: "#9B2335",
  },
  {
    id: "b3",
    title: "Ev Dekorasyon",
    subtitle: "Evini yenile, ilham al",
    image: "https://picsum.photos/seed/evdeko/400/200",
    href: "/ev-yasam",
    accent: "#2D6A4F",
  },
];

export function CategoryBanners() {
  return (
    <section className="max-w-[1200px] mx-auto mb-4">
      <div className="grid grid-cols-3 gap-3">
        {BANNERS.map((b) => (
          <a
            key={b.id}
            href={b.href}
            className="relative h-[150px] rounded-lg overflow-hidden group block"
          >
            <Image
              src={b.image}
              alt={b.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-4"
              style={{
                background: `linear-gradient(to top, ${b.accent}dd 0%, transparent 60%)`,
              }}
            >
              <h3 className="text-white font-black text-base leading-tight">
                {b.title}
              </h3>
              <p className="text-white/80 text-xs">{b.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
