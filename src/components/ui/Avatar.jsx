import { initials } from "../../lib/format";

const TONES = ["bg-honey", "bg-olive", "bg-rust", "bg-crimson", "bg-honey-dark"];

export default function Avatar({ name, photo, size = 44 }) {
  const box = { width: size, height: size };
  if (photo) {
    return <img src={photo} alt="" style={box} className="shrink-0 rounded-full object-cover" />;
  }
  const tone = TONES[[...String(name)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TONES.length];
  return (
    <div
      style={{ ...box, fontSize: size * 0.38 }}
      className={`${tone} flex shrink-0 items-center justify-center rounded-full font-bold text-white`}
    >
      {initials(name)}
    </div>
  );
}
