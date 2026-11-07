import { parseItems } from "./orders";

export const EMPTY = { clients: [], transactions: [], expenses: [], orders: [] };

const text = (v) => (v === null || v === undefined ? "" : String(v));
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export function normalizeSnapshot(snap) {
  const clients = (snap.clients || [])
    .filter((r) => text(r.id).trim())
    .map((r) => ({
      id: text(r.id),
      name: text(r.name) || "Unnamed",
      company: text(r.company),
      phone: text(r.phone),
      photo: text(r.photo),
      created_at: text(r.created_at),
    }));

  const transactions = (snap.transactions || [])
    .filter((r) => text(r.id).trim() && (r.type === "charge" || r.type === "payment"))
    .map((r) => ({
      id: text(r.id),
      client_id: text(r.client_id),
      type: r.type,
      amount: num(r.amount),
      description: text(r.description),
      payment_method: text(r.payment_method),
      date: text(r.date),
      timestamp: text(r.timestamp),
    }));

  const expenses = (snap.expenses || [])
    .filter((r) => text(r.id).trim())
    .map((r) => ({ id: text(r.id), description: text(r.description), amount: num(r.amount), date: text(r.date) }));

  const orders = (snap.orders || [])
    .filter((r) => text(r.id).trim())
    .map((r) => ({
      id: text(r.id),
      order_no: text(r.order_no) || text(r.id),
      customer_name: text(r.customer_name),
      phone: text(r.phone),
      address: text(r.address),
      items: parseItems(r.items),
      total: num(r.total),
      payment_method: text(r.payment_method) || "Cash on Delivery",
      payment_status: text(r.payment_status) || "unpaid",
      status: text(r.status) || "new",
      notes: text(r.notes),
      source: text(r.source) || "manual",
      created_at: text(r.created_at),
      updated_at: text(r.updated_at),
    }));

  return { clients, transactions, expenses, orders };
}
