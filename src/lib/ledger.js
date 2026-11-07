import { round2 } from "./format";

export function enrichClients(clients, transactions) {
  const byClient = new Map();
  transactions.forEach((t) => {
    if (!byClient.has(t.client_id)) byClient.set(t.client_id, []);
    byClient.get(t.client_id).push(t);
  });
  return clients.map((client) => {
    const txns = (byClient.get(client.id) || []).slice().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const totalTaken = round2(txns.filter((t) => t.type === "charge").reduce((s, t) => s + t.amount, 0));
    const totalPaid = round2(txns.filter((t) => t.type === "payment").reduce((s, t) => s + t.amount, 0));
    return { ...client, transactions: txns, totalTaken, totalPaid, balance: round2(totalTaken - totalPaid) };
  });
}

export function vodafoneInflows(clients) {
  const rows = [];
  clients.forEach((client) => {
    client.transactions.forEach((txn) => {
      if (txn.type === "payment" && txn.payment_method === "Vodafone Cash") rows.push({ client, txn });
    });
  });
  return rows.sort((a, b) => b.txn.timestamp.localeCompare(a.txn.timestamp));
}

export function vodafoneBalance(clients, expenses) {
  const inflow = vodafoneInflows(clients).reduce((s, r) => s + r.txn.amount, 0);
  const outflow = expenses.reduce((s, e) => s + e.amount, 0);
  return round2(inflow - outflow);
}

export function statistics(clients, expenses) {
  const withDebt = clients.filter((c) => c.balance > 0);
  const allTxns = clients.flatMap((c) => c.transactions);
  const topDebtor = clients.reduce((best, c) => (best === null || c.balance > best.balance ? c : best), null);
  return {
    total_clients: clients.length,
    clients_with_debt: withDebt.length,
    total_outstanding: round2(withDebt.reduce((s, c) => s + c.balance, 0)),
    total_credit: round2(clients.filter((c) => c.balance < 0).reduce((s, c) => s - c.balance, 0)),
    total_collected: round2(allTxns.filter((t) => t.type === "payment").reduce((s, t) => s + t.amount, 0)),
    total_goods_value: round2(allTxns.filter((t) => t.type === "charge").reduce((s, t) => s + t.amount, 0)),
    vodafone_balance: vodafoneBalance(clients, expenses),
    top_debtor: topDebtor && topDebtor.balance > 0 ? topDebtor.name : "-",
  };
}

export function topDebtors(clients, limit = 5) {
  return clients
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit);
}

export function recentTransactions(clients, limit = 8) {
  const rows = [];
  clients.forEach((client) => client.transactions.forEach((txn) => rows.push({ client, txn })));
  return rows.sort((a, b) => b.txn.timestamp.localeCompare(a.txn.timestamp)).slice(0, limit);
}

export function paymentBreakdown(clients) {
  const totals = {};
  clients.forEach((c) =>
    c.transactions.forEach((t) => {
      if (t.type === "payment") totals[t.payment_method] = (totals[t.payment_method] || 0) + t.amount;
    })
  );
  return Object.entries(totals).map(([method, total]) => ({ method, total: round2(total) }));
}

export function monthlyTrend(clients, months = 6, today = new Date()) {
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    let month = today.getMonth() + 1 - i;
    let year = today.getFullYear();
    while (month <= 0) {
      month += 12;
      year -= 1;
    }
    buckets.push({ year, month, total: 0 });
  }
  clients.forEach((c) =>
    c.transactions.forEach((t) => {
      if (t.type !== "payment") return;
      const [y, m] = t.date.split("-").map(Number);
      const bucket = buckets.find((b) => b.year === y && b.month === m);
      if (bucket) bucket.total += t.amount;
    })
  );
  return buckets.map((b) => ({
    month: `${String(b.month).padStart(2, "0")}/${String(b.year).slice(2)}`,
    total: round2(b.total),
  }));
}

export function orderStats(orders) {
  return {
    new_orders: orders.filter((o) => o.status === "new").length,
    in_progress: orders.filter((o) => o.status === "confirmed" || o.status === "shipped").length,
    delivered_revenue: round2(orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0)),
    total_orders: orders.length,
  };
}
