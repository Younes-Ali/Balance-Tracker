import Card from "./Card";

const TONES = {
  honey: { bar: "bg-honey", bg: "bg-honey-light", text: "text-honey-dark" },
  olive: { bar: "bg-olive", bg: "bg-olive-light", text: "text-olive-dark" },
  rust: { bar: "bg-rust", bg: "bg-rust-light", text: "text-rust-dark" },
  crimson: { bar: "bg-crimson", bg: "bg-crimson-light", text: "text-crimson-dark" },
  slate: { bar: "bg-slate", bg: "bg-slate-light", text: "text-slate-dark" },
  plum: { bar: "bg-plum", bg: "bg-plum-light", text: "text-plum-dark" },
};

export default function StatCard({ icon: Icon, label, value, tone = "honey", stack = false }) {
  const t = TONES[tone];
  const long = String(value).length > 10;
  return (
    <Card className="flex overflow-hidden">
      <div className={`w-1.5 shrink-0 ${t.bar}`} />
      <div className={`min-w-0 flex-1 p-3 sm:p-4 ${stack ? "" : "flex items-center gap-3"}`}>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${t.bg} ${stack ? "mb-2" : ""}`}>
          <Icon size={17} className={t.text} />
        </div>
        <div className="min-w-0">
          <p className={`break-words font-serif font-bold leading-tight text-ink ${long ? "text-sm" : "text-xl"}`}>{value}</p>
          <p className="mt-0.5 text-xs leading-tight text-muted">{label}</p>
        </div>
      </div>
    </Card>
  );
}
