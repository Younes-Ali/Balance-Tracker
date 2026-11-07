import { useState } from "react";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { parseAmount } from "../../lib/format";
import { useGuard } from "../../lib/useGuard";
import Button from "../ui/Button";
import Field, { Segmented, TextInput } from "../ui/Field";
import Modal from "../ui/Modal";

export default function PaymentModal({ client, open, onClose }) {
  const { addPayment } = useData();
  const toast = useToast();
  const guard = useGuard();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function close() {
    setAmount("");
    setMethod("Cash");
    setNote("");
    onClose();
  }

  async function submit(e) {
    e.preventDefault();
    const value = parseAmount(amount);
    if (!(value > 0)) {
      toast("Enter an amount above zero", "error");
      return;
    }
    setBusy(true);
    const ok = await guard(() => addPayment(client.id, value, method, note.trim()), "Payment recorded");
    setBusy(false);
    if (ok) close();
  }

  return (
    <Modal open={open} onClose={close} title={`${client.name} paid`}>
      <form onSubmit={submit}>
        <Field label="Amount (EGP)">
          <TextInput value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="0.00" />
        </Field>
        <div className="mb-4">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Payment method</span>
          <Segmented value={method} onChange={setMethod} options={["Cash", "Vodafone Cash"]} />
        </div>
        <Field label="Note (optional)">
          <TextInput value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <Button type="submit" variant="olive" full disabled={busy}>
          {busy ? "Saving..." : "Record Payment"}
        </Button>
      </form>
    </Modal>
  );
}
