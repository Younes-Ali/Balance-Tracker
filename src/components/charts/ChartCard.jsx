import Card from "../ui/Card";

export default function ChartCard({ title, empty, children }) {
  return (
    <Card className="p-4">
      <h3 className="mb-2 font-serif text-base font-bold text-ink">{title}</h3>
      {empty ? <p className="flex h-[240px] items-center justify-center text-sm text-muted">Not enough data yet</p> : children}
    </Card>
  );
}
