const VARIANTS = {
  honey: "bg-honey text-white hover:bg-honey-dark active:bg-honey-dark",
  olive: "bg-olive text-white hover:bg-olive-dark active:bg-olive-dark",
  rust: "bg-rust text-white hover:bg-rust-dark active:bg-rust-dark",
  crimson: "bg-crimson text-white hover:bg-crimson-dark active:bg-crimson-dark",
  slate: "bg-slate text-white hover:bg-slate-dark active:bg-slate-dark",
  outline: "border border-line bg-card text-ink-soft hover:bg-card-alt active:bg-card-alt",
  danger: "border border-line bg-card text-rust-dark hover:bg-rust-light active:bg-rust-light",
  ghost: "bg-transparent text-ink-soft hover:bg-card-alt",
};

const SIZES = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3.5 text-base",
};

export default function Button({
  children,
  variant = "honey",
  size = "md",
  icon: Icon,
  full = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors
        disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]}
        ${full ? "w-full" : ""} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
