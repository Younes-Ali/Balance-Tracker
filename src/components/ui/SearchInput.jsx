import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search" }) {
  return (
    <div className="relative flex-1">
      <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-card py-3 pl-10 pr-3 text-ink placeholder:text-muted outline-none focus:border-honey focus:ring-2 focus:ring-honey/20"
      />
    </div>
  );
}
