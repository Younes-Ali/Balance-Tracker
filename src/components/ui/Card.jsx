export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`rounded-2xl border border-line bg-card ${className}`} {...props}>
      {children}
    </div>
  );
}
