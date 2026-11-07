import { STATUS_LABELS } from "../../lib/orders";
import Badge from "../ui/Badge";

const TONES = { new: "honey", confirmed: "slate", shipped: "plum", delivered: "olive", cancelled: "rust" };

export default function StatusBadge({ status }) {
  return <Badge tone={TONES[status] || "neutral"}>{STATUS_LABELS[status] || status}</Badge>;
}
