export default function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={`${import.meta.env.BASE_URL}raheeq_logo.jpg`}
        alt="Raheeq"
        className={`rounded-md object-cover ${compact ? "h-9 w-14" : "h-12 w-[72px]"}`}
      />
      <div className="leading-tight">
        <p className="font-serif text-lg font-bold text-white">Raheeq</p>
        <p className="text-[11px] text-[#d9ccb4]">Balance Tracker</p>
      </div>
    </div>
  );
}
