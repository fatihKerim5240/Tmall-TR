"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { ALL_PRODUCTS } from "@/lib/products";

const CATEGORIES = [
  "Tüm Kategoriler", "Elektronik", "Kadın Giyim", "Erkek Giyim",
  "Ev & Yaşam", "Kozmetik", "Spor", "Anne & Bebek", "Gıda",
];

const HOT_SEARCHES = [
  "iPhone 15", "Nike Air Max", "Dyson Saç Kurutma", "AirPods Pro", "Zara Ceket", "PS5",
];

const HISTORY_KEY = "tmall_search_history";

function mockSearch(q: string): string[] {
  if (!q.trim() || q.trim().length < 2) return [];
  const lower = q.toLowerCase();
  return ALL_PRODUCTS
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower) ||
        (p as { brand?: string }).brand?.toLowerCase().includes(lower) ||
        p.shop?.toLowerCase().includes(lower)
    )
    .slice(0, 7)
    .map((p) => p.name);
}

interface Props {
  query: string;
  onChange: (q: string) => void;
  onSearch: (q: string) => void;
  /** Camera & mic buttons rendered inside the input box */
  extraButtons?: React.ReactNode;
}

export function SearchBar({ query, onChange, onSearch, extraButtons }: Props) {
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState("Tüm Kategoriler");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => mockSearch(query), [query]);

  // Load history once from localStorage (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch { /* empty */ }
  }, []);

  const saveHistory = (q: string) => {
    const updated = [q, ...history.filter((h) => h !== q)].slice(0, 6);
    setHistory(updated);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { /* empty */ }
  };

  const handleSearch = (q: string = query) => {
    const trimmed = q.trim();
    if (!trimmed) { inputRef.current?.focus(); return; }
    saveHistory(trimmed);
    onChange(trimmed);
    setFocused(false);
    inputRef.current?.blur();
    onSearch(trimmed);
  };

  const clearHistory = () => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* empty */ }
  };

  const showSuggestions = focused && query.trim().length >= 2 && suggestions.length > 0;
  const showHistory     = focused && !showSuggestions && history.length > 0;
  const showHot         = focused && !showSuggestions && !showHistory;
  const showDropdown    = showSuggestions || showHistory || showHot;

  return (
    <div className="flex-1 relative min-w-0">

      {/* Input wrapper */}
      <div
        className={`flex items-center bg-white rounded-sm overflow-hidden border-2 transition-all ${
          focused ? "border-[#FF6600]" : "border-transparent"
        }`}
      >
        {/* Category selector */}
        <div className="hidden md:block relative flex-shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs text-gray-500 border-r border-gray-200 px-2 py-0 h-10 bg-gray-50 focus:outline-none cursor-pointer pr-7 appearance-none"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[9px]">▾</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder="Ürün, kategori veya marka ara..."
          className="flex-1 h-9 md:h-10 px-2 md:px-3 text-sm focus:outline-none text-gray-800 min-w-0"
        />

        {/* Clear */}
        {query && (
          <button
            onMouseDown={(e) => { e.preventDefault(); onChange(""); inputRef.current?.focus(); }}
            className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
            aria-label="Temizle"
          >
            <X size={14} />
          </button>
        )}

        {/* Camera / Mic slot */}
        {extraButtons}

        {/* Search button */}
        <button
          onClick={() => handleSearch()}
          className="h-9 md:h-10 px-3 md:px-5 bg-[#FF6600] hover:bg-[#E55A00] text-white font-bold text-sm transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Ara</span>
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border border-gray-100 rounded-b-xl z-[54] overflow-hidden">

          {showSuggestions && (
            <div className="p-3">
              <p className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-wide">Öneriler</p>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => handleSearch(s)}
                  className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF0036] rounded-lg transition-colors"
                >
                  <Search size={12} className="text-gray-300 flex-shrink-0" />
                  <span className="truncate">{s}</span>
                </button>
              ))}
            </div>
          )}

          {showHistory && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Son Aramalar</p>
                <button
                  onMouseDown={clearHistory}
                  className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                >
                  Temizle
                </button>
              </div>
              {history.map((h) => (
                <button
                  key={h}
                  onMouseDown={() => handleSearch(h)}
                  className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#FF0036] rounded-lg transition-colors"
                >
                  <Clock size={12} className="text-gray-300 flex-shrink-0" />
                  <span className="truncate">{h}</span>
                </button>
              ))}
            </div>
          )}

          {showHot && (
            <div className="p-3">
              <p className="text-[10px] text-gray-400 font-semibold mb-2 uppercase tracking-wide flex items-center gap-1">
                <TrendingUp size={10} /> Popüler Aramalar
              </p>
              <div className="flex flex-wrap gap-2">
                {HOT_SEARCHES.map((term, i) => (
                  <button
                    key={term}
                    onMouseDown={() => handleSearch(term)}
                    className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#FF0036] px-2.5 py-1.5 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className={`text-xs font-bold w-4 text-center ${
                      i === 0 ? "text-[#FF0036]" : i === 1 ? "text-[#FF6600]" : i === 2 ? "text-[#FAAD14]" : "text-gray-300"
                    }`}>{i + 1}</span>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
