import { WifiOff } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useData } from "../../context/DataContext";
import BottomNav from "./BottomNav";
import MobileTopBar from "./MobileTopBar";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const { status } = useData();
  return (
    <div className="min-h-dvh md:pl-60">
      <Sidebar />
      <MobileTopBar />
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-4 md:px-8 md:pb-10 md:pt-8">
        {status === "offline" && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-xl bg-rust-light px-4 py-3 text-sm text-rust-dark"
          >
            <WifiOff size={16} className="mt-0.5 shrink-0" />
            <span>You are offline. Showing your last saved copy - changes cannot be saved until you reconnect.</span>
          </div>
        )}
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
