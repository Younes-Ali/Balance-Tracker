const INPUT =
  "w-full rounded-xl border border-line bg-card px-3.5 py-3 text-ink placeholder:text-muted outline-none focus:border-honey focus:ring-2 focus:ring-honey/20";

export default function Field({ label, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input className={INPUT} {...props} />;
}

export function TextArea(props) {
  return <textarea rows={2} className={INPUT} {...props} />;
}

export function SelectInput({ options, ...props }) {
  return (
    <select className={`${INPUT} appearance-none`} {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function Segmented({ value, onChange, options }) {
  return (
    <div className="grid grid-flow-col gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
            value === opt ? "border-olive bg-olive-light text-olive-dark" : "border-line bg-card text-ink-soft"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
