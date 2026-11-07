import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { parseAmount } from "../../lib/format";
import { useGuard } from "../../lib/useGuard";
import Button from "../ui/Button";
import Field, { TextInput } from "../ui/Field";
import Modal from "../ui/Modal";

export default function ExpenseModal({ open, onClose }) {
  const { addExpense } = useData();
  const toast = useToast();
  const guard = useGuard();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  function close() {
    setDescription("");
    setAmount("");
    onClose();
  }

  async function submit(e) {
    e.preventDefault();
    const value = parseAmount(amount);
    if (!description.trim() || !(value > 0)) {
      toast("Enter a description and an amount above zero", "error");
      return;
    }
    setBusy(true);
    const ok = await guard(() => addExpense(description.trim(), value), "Expense added");
    setBusy(false);
    if (ok) close();
  }

  return (
    <Modal open={open} onClose={close} title="New Expense">
      <form onSubmit={submit}>
        <Field label="Description">
          <TextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Delivery fuel" />
        </Field>
        <Field label="Amount (EGP)">
          <TextInput value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" />
        </Field>
        <Button type="submit" variant="crimson" full disabled={busy}>
          {busy ? "Saving..." : "Add Expense"}
        </Button>
      </form>
    </Modal>
  );
}
