import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import OrderCard from "../components/orders/OrderCard";
import OrderFormModal from "../components/orders/OrderFormModal";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import StatCard from "../components/ui/StatCard";
import { Bell, CheckCircle2, Truck } from "lucide-react";
import { useData } from "../context/DataContext";
import { money0 } from "../lib/format";
import { STATUSES, STATUS_LABELS } from "../lib/orders";
import { useGuard } from "../lib/useGuard";

const FILTERS = ["all", ...STATUSES];

export default function OrdersPage() {
  const { data, derived, patchOrder, removeOrder } = useData();
  const guard = useGuard();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const orders = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return data.orders
      .filter((o) => filter === "all" || o.status === filter)
      .filter((o) => !kw || [o.order_no, o.customer_name, o.phone].some((v) => v.toLowerCase().includes(kw)))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [data.orders, filter, search]);

  async function confirmDelete() {
    const ok = await guard(() => removeOrder(deleting.id), "Order deleted");
    if (ok) setDeleting(null);
  }

  const stats = derived.orderStats;

  return (
    <div>
      <PageHeader
        title="Online Orders"
        subtitle="From the Raheeq shop, plus the ones you add by hand"
        action={<Button icon={Plus} variant="olive" onClick={() => setAdding(true)}>Add</Button>}
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatCard stack icon={Bell} label="New" value={stats.new_orders} tone="honey" />
        <StatCard stack icon={Truck} label="In Progress" value={stats.in_progress} tone="slate" />
        <StatCard stack icon={CheckCircle2} label="Delivered" value={money0(stats.delivered_revenue)} tone="olive" />
      </div>

      <div className="mb-3 flex">
        <SearchInput value={search} onChange={setSearch} placeholder="Search order, customer or phone" />
      </div>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              filter === f ? "bg-bark text-white" : "border border-line bg-card text-ink-soft"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <EmptyState>No orders to show.</EmptyState>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onPatch={patchOrder} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <OrderFormModal open={adding} onClose={() => setAdding(false)} />
      <ConfirmDialog
        open={!!deleting}
        title="Delete order"
        message={deleting ? `Delete order ${deleting.order_no}? This cannot be undone.` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
