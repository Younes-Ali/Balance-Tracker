import { money } from "../../lib/format";
import Badge from "./Badge";

export default function BalanceBadge({ balance }) {
  if (balance > 0) return <Badge tone="rust">Owes {money(balance)}</Badge>;
  if (balance < 0) return <Badge tone="olive">Credit {money(-balance)}</Badge>;
  return <Badge>Settled</Badge>;
}
