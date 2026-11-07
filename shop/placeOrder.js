const API_URL = import.meta.env.VITE_SHEETS_API_URL;
const SHOP_KEY = import.meta.env.VITE_SHOP_API_KEY;

export const PAYMENT_METHODS = ["Cash on Delivery", "Vodafone Cash", "Instapay"];

export async function placeOrder({ customerName, phone, address, items, paymentMethod, notes = "" }) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      token: SHOP_KEY,
      action: "create_order",
      order: {
        customer_name: customerName,
        phone,
        address,
        items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        payment_method: paymentMethod,
        notes,
      },
    }),
  });
  if (!res.ok) throw new Error("Could not reach the shop server. Please try again.");
  const body = await res.json();
  if (!body.ok) {
    const friendly = {
      missing_fields: "Please fill in your name, phone and address.",
      invalid_phone: "That phone number does not look right.",
      no_items: "Your cart is empty.",
      order_too_large: "That order is too large - please split it into two.",
    };
    throw new Error(friendly[body.error] || "Something went wrong placing your order.");
  }
  return body.data;
}
