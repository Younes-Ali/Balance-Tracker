import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { money } from "../../lib/format";
import { PAYMENT_METHODS, calcTotal } from "../../lib/orders";
import { useGuard } from "../../lib/useGuard";
import Button from "../ui/Button";
import Field, { SelectInput, TextArea, TextInput } from "../ui/Field";
import Modal from "../ui/Modal";

const MAX_ITEMS = 12;
const blankRow = () => ({ name: "", qty: "1", price: "" });
const BLANK = { customer_name: "", phone: "", address: "", payment_method: PAYMENT_METHODS[0], notes: "" };

function readItems(rows) {
  const items = [];
  for (const row of rows) {
    const name = row.name.trim();
    if (!name && !row.price.trim()) continue;
    const qty = Number(row.qty);
    const price = Number(row.price.replace(",", "."));
    if (!name || !Number.isInteger(qty) || qty < 1 || !Number.isFinite(price) || price < 0) return null;
    items.push({ name, qty, price });
  }
  return items;
}

export default function OrderFormModal({ open, onClose }) {
  const { addOrder } = useData();
  const toast = useToast();
  const guard = useGuard();
  const [form, setForm] = useState(BLANK);
  const [rows, setRows] = useState([blankRow()]);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setRow = (index, key, value) => setRows((list) => list.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  const total = calcTotal(readItems(rows) || []);

  function close() {
    setForm(BLANK);
    setRows([blankRow()]);
    onClose();
  }

  async function submit(e) {
    e.preventDefault();
    const { customer_name, phone, address } = form;
    if (!customer_name.trim() || !phone.trim() || !address.trim()) {
      toast("Customer name, phone and address are required", "error");
      return;
    }
    const items = readItems(rows);
    if (items === null) {
      toast("Each item needs a name, a whole-number quantity and a price", "error");
      return;
    }
    if (!items.length) {
      toast("Add at least one item", "error");
      return;
    }
    setBusy(true);
    const ok = await guard(
      () =>
        addOrder({
          customer_name: customer_name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          payment_method: form.payment_method,
          notes: form.notes.trim(),
          items,
        }),
      "Order added"
    );
    setBusy(false);
    if (ok) close();
  }

  return (
    <Modal open={open} onClose={close} title="New Online Order" wide>
      <form onSubmit={submit}>
        <Field label="Customer name">
          <TextInput value={form.customer_name} onChange={set("customer_name")} autoComplete="off" />
        </Field>
        <Field label="Phone">
          <TextInput value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="off" />
        </Field>
        <Field label="Delivery address">
          <TextInput value={form.address} onChange={set("address")} autoComplete="off" />
        </Field>
        <Field label="Payment method">
          <SelectInput
            value={form.payment_method}
            onChange={set("payment_method")}
            options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
          />
        </Field>
        <Field label="Notes (optional)">
          <TextArea value={form.notes} onChange={set("notes")} />
        </Field>

        <p className="mb-1.5 text-sm font-semibold text-ink">Items</p>
        <div className="mb-2 space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_56px_84px_32px] items-center gap-2">
              <TextInput value={row.name} onChange={(e) => setRow(i, "name", e.target.value)} placeholder="Product" aria-label="Product" />
              <TextInput value={row.qty} onChange={(e) => setRow(i, "qty", e.target.value)} inputMode="numeric" aria-label="Quantity" />
              <TextInput value={row.price} onChange={(e) => setRow(i, "price", e.target.value)} inputMode="decimal" placeholder="Price" aria-label="Price" />
              <button
                type="button"
                aria-label="Remove item"
                disabled={rows.length === 1}
                onClick={() => setRows((list) => list.filter((_, idx) => idx !== i))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-card-alt disabled:opacity-30"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            disabled={rows.length >= MAX_ITEMS}
            onClick={() => setRows((list) => [...list, blankRow()])}
            className="flex items-center gap-1 text-sm font-semibold text-honey-dark disabled:opacity-40"
          >
            <Plus size={15} /> Add item
          </button>
          <p className="font-serif text-lg font-bold text-ink">Total: {money(total)} EGP</p>
        </div>
        <Button type="submit" variant="olive" full disabled={busy}>
          {busy ? "Saving..." : "Save Order"}
        </Button>
      </form>
    </Modal>
  );
}
