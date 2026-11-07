import { CreditCard, Download, Upload } from "lucide-react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import ExpenseModal from "../components/vodafone/ExpenseModal";
import { useData } from "../context/DataContext";
import { money } from "../lib/format";
import { useGuard } from "../lib/useGuard";

export default function VodafonePage() {
  const { data, derived, removeExpense } = useData();
  const guard = useGuard();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const inflow = derived.inflows.reduce((sum, row) => sum + row.txn.amount, 0);
  const outflow = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const expenses = [...data.expenses].sort((a, b) => b.date.localeCompare(a.date));

  async function confirmDelete() {
    const ok = await guard(() => removeExpense(deleting.id), "Expense deleted");
    if (ok) setDeleting(null);
  }

  return (
    <div>
      <PageHeader title="Vodafone Cash" subtitle="Money coming in from clients and what goes out" />

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard stack icon={CreditCard} label="Balance" value={money(derived.vodafoneBalance)} tone="crimson" />
        <StatCard stack icon={Download} label="Received" value={money(inflow)} tone="olive" />
        <StatCard stack icon={Upload} label="Spent" value={money(outflow)} tone="rust" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="px-4 pt-4 font-serif text-base font-bold text-ink">Payments Received</h3>
          {derived.inflows.length === 0 ? (
            <EmptyState>No Vodafone Cash payments recorded yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-line-soft">
              {derived.inflows.map(({ client, txn }) => (
                <li key={txn.id}>
                  <Link to={`/clients/${client.id}`} className="flex items-center justify-between gap-3 px-4 py-3 active:bg-card-alt">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{client.name}</p>
                      <p className="text-xs text-muted">{txn.date}</p>
                    </div>
                    <span className="text-sm font-bold text-olive-dark">+{money(txn.amount)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between px-4 pt-4">
            <h3 className="font-serif text-base font-bold text-ink">Expenses</h3>
            <Button size="sm" variant="crimson" icon={Plus} onClick={() => setAdding(true)}>Add</Button>
          </div>
          {expenses.length === 0 ? (
            <EmptyState>No expenses recorded yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-line-soft">
              {expenses.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{e.description}</p>
                    <p className="text-xs text-muted">{e.date}</p>
                  </div>
                  <span className="text-sm font-bold text-rust-dark">-{money(e.amount)}</span>
                  <button
                    onClick={() => setDeleting(e)}
                    aria-label="Delete expense"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-card-alt"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <ExpenseModal open={adding} onClose={() => setAdding(false)} />
      <ConfirmDialog
        open={!!deleting}
        title="Delete expense"
        message={deleting ? `Delete "${deleting.description}"?` : ""}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
