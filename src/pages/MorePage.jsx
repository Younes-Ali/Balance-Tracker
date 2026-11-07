import { BarChart3, ChevronRight, Info, LogOut, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

function host(url) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function MorePage() {
  const { session, logout } = useAuth();
  const { refresh, status } = useData();
  const rowClass = "flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold text-ink active:bg-card-alt";

  return (
    <div>
      <PageHeader title="More" subtitle={`Connected to ${host(session.url)}`} />
      <Card className="divide-y divide-line-soft overflow-hidden">
        <Link to="/analytics" className={rowClass}>
          <BarChart3 size={19} className="text-honey-dark" />
          <span className="flex-1">Analytics</span>
          <ChevronRight size={17} className="text-muted" />
        </Link>
        <Link to="/about" className={rowClass}>
          <Info size={19} className="text-honey-dark" />
          <span className="flex-1">About Raheeq</span>
          <ChevronRight size={17} className="text-muted" />
        </Link>
        <button onClick={refresh} className={rowClass}>
          <RefreshCw size={19} className={`text-slate ${status === "syncing" ? "animate-spin" : ""}`} />
          <span className="flex-1">Sync now</span>
        </button>
        <button onClick={logout} className={`${rowClass} text-rust-dark`}>
          <LogOut size={19} />
          <span className="flex-1">Log out of this device</span>
        </button>
      </Card>
    </div>
  );
}
