import {
  Banknote,
  Bell,
  CheckCircle2,
  CreditCard,
  Package,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { useData } from "../context/DataContext";
import { money, money0 } from "../lib/format";

export default function SummaryPage() {
  const { derived } = useData();
  const { stats, orderStats, topDebtors, recent } = derived;

  return (
    <div>
      <PageHeader title="Summary" subtitle="Who owes you, what came in, and what is waiting to ship" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Users} label="Total Clients" value={stats.total_clients} tone="honey" />
        <StatCard icon={Wallet} label="Clients With Debt" value={stats.clients_with_debt} tone="rust" />
        <StatCard icon={Banknote} label="Total Outstanding" value={money0(stats.total_outstanding)} tone="rust" />
        <StatCard icon={CheckCircle2} label="Total Collected" value={money0(stats.total_collected)} tone="olive" />
        <StatCard icon={Package} label="Goods Given (value)" value={money0(stats.total_goods_value)} tone="honey" />
        <StatCard icon={CreditCard} label="Vodafone Cash Balance" value={money0(stats.vodafone_balance)} tone="crimson" />
        <StatCard icon={TrendingUp} label="Credit Balance" value={money0(stats.total_credit)} tone="olive" />
        <StatCard icon={Trophy} label="Top Debtor" value={stats.top_debtor} tone="rust" />
        <StatCard icon={Bell} label="New Online Orders" value={orderStats.new_orders} tone="honey" />
        <StatCard icon={Truck} label="Orders In Progress" value={orderStats.in_progress} tone="slate" />
        <StatCard icon={Banknote} label="Online Sales (delivered)" value={money0(orderStats.delivered_revenue)} tone="olive" />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="px-4 pt-4 font-serif text-base font-bold text-ink">Top Debtors</h3>
          {topDebtors.length === 0 ? (
            <EmptyState>No outstanding balances - everyone is settled</EmptyState>
          ) : (
            <ul className="divide-y divide-line-soft">
              {topDebtors.map((c) => (
                <li key={c.id}>
                  <Link to={`/clients/${c.id}`} className="flex items-center gap-3 px-4 py-3 active:bg-card-alt">
                    <Avatar name={c.name} photo={c.photo} size={36} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{c.name}</span>
                    <span className="text-sm font-bold text-rust-dark">{money(c.balance)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="px-4 pt-4 font-serif text-base font-bold text-ink">Recent Transactions</h3>
          {recent.length === 0 ? (
            <EmptyState>No transactions recorded yet</EmptyState>
          ) : (
            <ul className="divide-y divide-line-soft">
              {recent.map(({ client, txn }) => (
                <li key={txn.id}>
                  <Link to={`/clients/${client.id}`} className="flex items-center justify-between gap-3 px-4 py-3 active:bg-card-alt">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{client.name}</p>
                      <p className="text-xs text-muted">{txn.date}</p>
                    </div>
                    {txn.type === "charge" ? (
                      <Badge tone="rust" small>Took Goods</Badge>
                    ) : (
                      <Badge tone="olive" small>Paid · {txn.payment_method || "Cash"}</Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
