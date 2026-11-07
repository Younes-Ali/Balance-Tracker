import { useMemo } from "react";
import ChartCard from "../components/charts/ChartCard";
import { OutstandingChart, PaymentMethodsChart, TopDebtorsChart, TrendChart } from "../components/charts/Charts";
import PageHeader from "../components/ui/PageHeader";
import { useData } from "../context/DataContext";
import { monthlyTrend, paymentBreakdown, topDebtors } from "../lib/ledger";

export default function AnalyticsPage() {
  const { derived } = useData();
  const { clients, stats } = derived;

  const methods = useMemo(() => paymentBreakdown(clients), [clients]);
  const trend = useMemo(() => monthlyTrend(clients, 6), [clients]);
  const debtors = useMemo(() => topDebtors(clients, 5).map((c) => ({ name: c.name, balance: c.balance })), [clients]);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Collections, debt and payment methods at a glance" />
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Payment Methods" empty={methods.length === 0}>
          <PaymentMethodsChart data={methods} />
        </ChartCard>
        <ChartCard title="Outstanding vs Collected" empty={stats.total_outstanding === 0 && stats.total_collected === 0}>
          <OutstandingChart outstanding={stats.total_outstanding} collected={stats.total_collected} />
        </ChartCard>
        <ChartCard title="Collections - Last 6 Months" empty={trend.every((t) => t.total === 0)}>
          <TrendChart data={trend} />
        </ChartCard>
        <ChartCard title="Top 5 Debtors" empty={debtors.length === 0}>
          <TopDebtorsChart data={debtors} />
        </ChartCard>
      </div>
    </div>
  );
}
