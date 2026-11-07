const TONES = {
  honey: "bg-honey-light text-honey-dark",
  olive: "bg-olive-light text-olive-dark",
  rust: "bg-rust-light text-rust-dark",
  crimson: "bg-crimson-light text-crimson-dark",
  slate: "bg-slate-light text-slate-dark",
  plum: "bg-plum-light text-plum-dark",
  neutral: "bg-line-soft text-ink-soft",
};

export default function Badge({ tone = "neutral", children, small = false }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full font-semibold ${TONES[tone]} ${
        small ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
      }`}
    >
      {children}
    </span>
  );
}
