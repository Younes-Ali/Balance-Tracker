import { ArrowLeft, MessageCircle, Pencil, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChargeModal from "../components/clients/ChargeModal";
import ClientFormModal from "../components/clients/ClientFormModal";
import PaymentModal from "../components/clients/PaymentModal";
import TransactionRow from "../components/clients/TransactionRow";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import { useData } from "../context/DataContext";
import { money, money0, whatsappNumber } from "../lib/format";
import { useGuard } from "../lib/useGuard";

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { derived, status, removeClient, removeTransaction } = useData();
  const guard = useGuard();
  const [charging, setCharging] = useState(false);
  const [paying, setPaying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);
  const [deletingTxn, setDeletingTxn] = useState(null);

  const client = derived.byId[id];

  if (!client) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-muted">{status === "loading" ? "Loading..." : "This client was not found."}</p>
        <Link to="/clients" className="text-sm font-semibold text-honey-dark">Back to Clients</Link>
      </div>
    );
  }

  const balance = client.balance;
  const tone = balance > 0 ? "text-rust-dark" : balance < 0 ? "text-olive-dark" : "text-muted";
  const label = balance > 0 ? `Owes ${money(balance)}` : balance < 0 ? `Credit ${money(-balance)}` : "Settled";

  async function deleteClient() {
    const ok = await guard(() => removeClient(client.id), "Client deleted");
    if (ok) navigate("/clients");
  }

  async function deleteTxn() {
    const ok = await guard(() => removeTransaction(deletingTxn.id), "Transaction deleted");
    if (ok) setDeletingTxn(null);
  }

  return (
    <div>
      <Link to="/clients" className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-honey-dark">
        <ArrowLeft size={16} /> Clients
      </Link>

      <Card className="mb-4 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={client.name} photo={client.photo} size={72} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-2xl font-bold text-ink">{client.name}</h1>
            <p className="truncate text-sm text-muted">{[client.company, client.phone].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line-soft pt-4">
          <div>
            <p data-testid="client-balance" className={`font-serif text-2xl font-bold ${tone}`}>{label}</p>
            <p className="text-xs text-muted">
              Taken {money0(client.totalTaken)} · Paid {money0(client.totalPaid)}
            </p>
          </div>
          <div className="flex gap-2">
            <a href={`tel:${client.phone}`} aria-label="Call" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card-alt text-ink-soft">
              <Phone size={18} />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber(client.phone)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-olive-light text-olive-dark"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </Card>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <Button variant="rust" size="lg" onClick={() => setCharging(true)}>Took Goods</Button>
        <Button variant="olive" size="lg" onClick={() => setPaying(true)}>Paid</Button>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Button variant="outline" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>
        <Button variant="danger" icon={Trash2} onClick={() => setDeletingClient(true)}>Delete</Button>
      </div>

      <Card>
        <h3 className="px-4 pt-4 font-serif text-base font-bold text-ink">Transaction History</h3>
        {client.transactions.length === 0 ? (
          <EmptyState>No transactions recorded yet for this client.</EmptyState>
        ) : (
          <ul className="divide-y divide-line-soft">
            {client.transactions.map((t) => (
              <TransactionRow key={t.id} txn={t} onDelete={setDeletingTxn} />
            ))}
          </ul>
        )}
      </Card>

      <ChargeModal client={client} open={charging} onClose={() => setCharging(false)} />
      <PaymentModal client={client} open={paying} onClose={() => setPaying(false)} />
      <ClientFormModal open={editing} client={client} onClose={() => setEditing(false)} />
      <ConfirmDialog
        open={deletingClient}
        title="Delete client"
        message={`Delete ${client.name} and their whole transaction history? This cannot be undone.`}
        onConfirm={deleteClient}
        onCancel={() => setDeletingClient(false)}
      />
      <ConfirmDialog
        open={!!deletingTxn}
        title="Delete transaction"
        message="Remove this transaction? The client's balance will change."
        onConfirm={deleteTxn}
        onCancel={() => setDeletingTxn(null)}
      />
    </div>
  );
}
