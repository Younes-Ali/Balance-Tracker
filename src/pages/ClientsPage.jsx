import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ClientFormModal from "../components/clients/ClientFormModal";
import Avatar from "../components/ui/Avatar";
import BalanceBadge from "../components/ui/BalanceBadge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import { useData } from "../context/DataContext";

export default function ClientsPage() {
  const { derived } = useData();
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);

  const list = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return derived.clients
      .filter((c) => !kw || [c.name, c.company, c.phone].some((v) => v.toLowerCase().includes(kw)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [derived.clients, search]);

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle="Everyone who buys honey from Raheeq"
        action={<Button icon={Plus} variant="olive" onClick={() => setAdding(true)}>Add</Button>}
      />
      <div className="mb-4 flex">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, company or phone" />
      </div>
      {list.length === 0 ? (
        <EmptyState>{derived.clients.length ? "No clients match your search." : "No clients yet. Tap Add to create the first one."}</EmptyState>
      ) : (
        <ul className="space-y-2.5">
          {list.map((c) => (
            <li key={c.id}>
              <Link
                to={`/clients/${c.id}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 active:bg-card-alt"
              >
                <Avatar name={c.name} photo={c.photo} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{c.name}</p>
                  <p className="truncate text-xs text-muted">{[c.company, c.phone].filter(Boolean).join(" · ")}</p>
                </div>
                <BalanceBadge balance={c.balance} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <ClientFormModal open={adding} onClose={() => setAdding(false)} />
    </div>
  );
}
