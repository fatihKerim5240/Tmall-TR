"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export function SidebarShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 relative">
      {/* Overlay — mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#F5F5F5] z-50 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out
          md:static md:h-auto md:w-56 md:flex-shrink-0 md:bg-transparent md:shadow-none md:z-auto md:translate-x-0 md:overflow-visible
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 md:hidden bg-white">
          <span className="font-bold text-sm text-gray-800">Filtrele</span>
          <button onClick={() => setOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 md:p-0 space-y-3">{sidebar}</div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Floating filter button — mobile only */}
      <button
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#FF0036] text-white px-5 py-2.5 rounded-full shadow-lg font-semibold text-sm"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={14} />
        Filtrele
      </button>
    </div>
  );
}
