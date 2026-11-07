import { RefreshCw } from "lucide-react";
import { useData } from "../../context/DataContext";

const DOTS = {
  ok: "bg-[#8fbf86]",
  syncing: "bg-honey",
  loading: "bg-honey",
  offline: "bg-[#e0846a]",
};

function hhmm(date) {
  return date ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
}

export default function SyncStatus() {
  const { status, lastSync, error, refresh } = useData();
  const labels = {
    ok: `Synced ${hhmm(lastSync)}`,
    syncing: "Syncing...",
    loading: "Loading...",
    offline: "Offline",
  };
  return (
    <button
      onClick={refresh}
      title={error || "Sync now"}
      aria-label="Sync now"
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[#d9ccb4] hover:bg-bark-active"
    >
      <span className={`h-2 w-2 rounded-full ${DOTS[status]}`} />
      <span data-testid="sync-label">{labels[status]}</span>
      <RefreshCw size={13} className={status === "syncing" || status === "loading" ? "animate-spin" : ""} />
    </button>
  );
}
