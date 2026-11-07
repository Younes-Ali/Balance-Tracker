import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { money, whatsappNumber } from "../../lib/format";
import { NEXT_LABEL, NEXT_STATUS } from "../../lib/orders";
import { useGuard } from "../../lib/useGuard";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import StatusBadge from "./StatusBadge";

export default function OrderCard({ order, onPatch, onDelete }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const guard = useGuard();
  const paid = order.payment_status === "paid";
  const next = NEXT_STATUS[order.status];
  const count = order.items.reduce((n, i) => n + i.qty, 0);

  async function run(fn, message) {
    setBusy(true);
    await guard(fn, message);
    setBusy(false);
  }

  return (
    <Card>
      <button className="w-full p-4 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">{order.order_no}</span>
              {order.source === "shop" && <Badge tone="honey" small>SHOP</Badge>}
            </div>
            <p className="mt-0.5 truncate text-sm text-ink-soft">
              {order.customer_name} · {order.phone}
            </p>
            <p className="text-xs text-muted">
              {count} item{count === 1 ? "" : "s"} · {order.created_at.slice(0, 10)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="font-serif text-lg font-bold text-ink">{money(order.total)}</span>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <Badge tone={paid ? "olive" : "rust"} small>
            {paid ? "Paid" : "Unpaid"} · {order.payment_method}
          </Badge>
          <ChevronDown size={18} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {next && (
        <div className="px-4 pb-4">
          <Button full disabled={busy} onClick={() => run(() => onPatch(order.id, { status: next }))}>
            {NEXT_LABEL[order.status]}
          </Button>
        </div>
      )}

      {open && (
        <div className="space-y-4 rounded-b-2xl border-t border-line-soft bg-card-alt p-4 text-sm">
          <p className="text-ink-soft">{order.address}</p>
          <div className="flex gap-2">
            <a href={`tel:${order.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-card py-2.5 font-semibold text-ink-soft">
              <Phone size={15} /> Call
            </a>
            <a
              href={`https://wa.me/${whatsappNumber(order.phone)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-card py-2.5 font-semibold text-olive-dark"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
          <ul className="space-y-1.5">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="text-ink">
                  {item.name} × {item.qty}
                </span>
                <span className="shrink-0 text-ink-soft">{money(item.qty * item.price)}</span>
              </li>
            ))}
          </ul>
          {order.notes && <p className="italic text-ink-soft">{order.notes}</p>}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => run(() => onPatch(order.id, { payment_status: paid ? "unpaid" : "paid" }))}
            >
              {paid ? "Mark unpaid" : "Mark paid"}
            </Button>
            {order.status === "cancelled" ? (
              <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => onPatch(order.id, { status: "new" }))}>
                Reopen
              </Button>
            ) : (
              order.status !== "delivered" && (
                <Button size="sm" variant="danger" disabled={busy} onClick={() => run(() => onPatch(order.id, { status: "cancelled" }))}>
                  Cancel order
                </Button>
              )
            )}
            <Button size="sm" variant="ghost" className="ml-auto text-rust-dark" disabled={busy} onClick={() => onDelete(order)}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
