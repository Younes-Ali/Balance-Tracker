import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { useToast } from "../../context/ToastContext";
import { fileToDataUri } from "../../lib/photo";
import { useGuard } from "../../lib/useGuard";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Field, { TextInput } from "../ui/Field";
import Modal from "../ui/Modal";

const BLANK = { name: "", company: "", phone: "", photo: "" };

export default function ClientFormModal({ open, client, onClose }) {
  const { addClient, updateClient } = useData();
  const toast = useToast();
  const guard = useGuard();
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setForm(client ? { name: client.name, company: client.company, phone: client.phone, photo: client.photo } : BLANK);
  }, [open, client]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function pickPhoto(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const photo = await fileToDataUri(file);
      setForm((f) => ({ ...f, photo }));
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function submit(e) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name || !phone) {
      toast("Please enter at least the name and phone number", "error");
      return;
    }
    setBusy(true);
    const payload = { name, company: form.company.trim(), phone, photo: form.photo };
    const ok = await guard(
      () => (client ? updateClient(client.id, payload) : addClient(payload)),
      client ? "Client updated" : "Client added"
    );
    setBusy(false);
    if (ok) onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={client ? "Edit Client" : "Add New Client"}>
      <form onSubmit={submit}>
        <div className="mb-5 flex flex-col items-center gap-3">
          <Avatar name={form.name || "New Client"} photo={form.photo} size={88} />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-card-alt px-4 py-2.5 text-sm font-semibold text-ink-soft">
            <Camera size={16} />
            {form.photo ? "Change photo" : "Add photo"}
            <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" data-testid="photo-input" />
          </label>
        </div>
        <Field label="Client name">
          <TextInput value={form.name} onChange={set("name")} placeholder="Full name" autoComplete="off" />
        </Field>
        <Field label="Company">
          <TextInput value={form.company} onChange={set("company")} placeholder="Company (optional)" autoComplete="off" />
        </Field>
        <Field label="Phone number">
          <TextInput value={form.phone} onChange={set("phone")} placeholder="01xxxxxxxxx" inputMode="tel" autoComplete="off" />
        </Field>
        <Button type="submit" variant="olive" full disabled={busy}>
          {busy ? "Saving..." : client ? "Save Changes" : "Add Client"}
        </Button>
      </form>
    </Modal>
  );
}
