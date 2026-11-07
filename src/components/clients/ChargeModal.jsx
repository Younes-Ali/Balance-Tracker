import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { parseAmount } from "../../lib/format";
import { useGuard } from "../../lib/useGuard";
import Button from "../ui/Button";
import Field, { TextInput } from "../ui/Field";
import Modal from "../ui/Modal";

export default function ChargeModal({ client, open, onClose }) {
  const { addCharge } = useData();
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
      toast("Enter what they took and an amount above zero", "error");
      return;
    }
    setBusy(true);
    const ok = await guard(() => addCharge(client.id, description.trim(), value), "Recorded");
    setBusy(false);
    if (ok) close();
  }

  return (
    <Modal open={open} onClose={close} title={`${client.name} took goods`}>
      <form onSubmit={submit}>
        <Field label="What did they take?">
          <TextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. 50 jars 250g" />
        </Field>
        <Field label="Amount (EGP)">
          <TextInput value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" />
        </Field>
        <Button type="submit" variant="rust" full disabled={busy}>
          {busy ? "Saving..." : "Record"}
        </Button>
      </form>
    </Modal>
  );
}
