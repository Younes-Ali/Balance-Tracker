import { Trash2 } from "lucide-react";
import { money } from "../../lib/format";
import Badge from "../ui/Badge";

export default function TransactionRow({ txn, onDelete }) {
  const charge = txn.type === "charge";
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{txn.description || (charge ? "Goods" : "Payment")}</p>
        <p className="text-xs text-muted">{txn.date}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`text-sm font-bold ${charge ? "text-rust-dark" : "text-olive-dark"}`}>
          {charge ? "+" : "-"}
          {money(txn.amount)}
        </span>
        {charge ? (
          <Badge tone="rust" small>
            Took Goods
          </Badge>
        ) : (
          <Badge tone="olive" small>
            Paid · {txn.payment_method || "Cash"}
          </Badge>
        )}
      </div>
      <button
        onClick={() => onDelete(txn)}
        aria-label="Delete transaction"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-card-alt"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
