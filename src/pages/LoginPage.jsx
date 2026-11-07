import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Field, { TextInput } from "../components/ui/Field";

export default function LoginPage() {
  const { login } = useAuth();
  const [url, setUrl] = useState(import.meta.env.VITE_SHEETS_API_URL || "");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!url.trim() || !token.trim()) {
      setError("Enter both the API URL and your admin key.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(url, token);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="safe-top safe-bottom flex min-h-dvh items-center justify-center px-5 py-10">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-line bg-card p-7 shadow-sm">
        <img
          src={`${import.meta.env.BASE_URL}raheeq_logo.jpg`}
          alt="Raheeq Honey"
          className="mx-auto mb-4 h-24 w-36 rounded-xl object-cover"
        />
        <h1 className="mb-1 text-center font-serif text-2xl font-bold text-ink">Balance Tracker</h1>
        <p className="mb-6 text-center text-sm text-muted">Sign in with your admin key to open your books.</p>
        <Field label="API URL">
          <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://script.google.com/macros/s/.../exec" inputMode="url" autoCapitalize="off" autoCorrect="off" />
        </Field>
        <Field label="Admin key">
          <TextInput type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Admin API key" autoComplete="current-password" />
        </Field>
        {error && <p role="alert" className="mb-4 rounded-xl bg-rust-light px-3 py-2 text-sm text-rust-dark">{error}</p>}
        <Button type="submit" full size="lg" disabled={busy}>
          {busy ? "Connecting..." : "Connect"}
        </Button>
      </form>
    </div>
  );
}
