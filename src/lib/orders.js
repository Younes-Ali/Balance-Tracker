import { newId, round2 } from "./format";

export const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export const STATUS_LABELS = {
  new: "New",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const NEXT_STATUS = { new: "confirmed", confirmed: "shipped", shipped: "delivered" };
export const NEXT_LABEL = { new: "Confirm", confirmed: "Mark Shipped", shipped: "Mark Delivered" };

export const PAYMENT_METHODS = ["Cash on Delivery", "Vodafone Cash", "Instapay"];

export function calcTotal(items) {
  return round2(items.reduce((sum, i) => sum + Number(i.qty) * Number(i.price), 0));
}

export function parseItems(raw) {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw || "[]");
    } catch {
      return [];
    }
  }
  if (!Array.isArray(value)) return [];
  const items = [];
  value.forEach((item) => {
    const qty = Math.floor(Number(item && item.qty));
    const price = Number(item && item.price);
    const name = String((item && item.name) || "");
    if (name && Number.isFinite(qty) && Number.isFinite(price)) items.push({ name, qty, price });
  });
  return items;
}

export function buildOrderRecord({ customer_name, phone, address, items, payment_method, notes }, stamp, now = new Date()) {
  const id = newId();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return {
    id,
    order_no: `RQ-${yy}${mm}${dd}-${id.slice(0, 4).toUpperCase()}`,
    customer_name,
    phone,
    address,
    items,
    total: calcTotal(items),
    payment_method,
    payment_status: "unpaid",
    status: "new",
    notes: notes || "",
    source: "manual",
    created_at: stamp,
    updated_at: stamp,
  };
}
