import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Brand from "./Brand";
import { SIDEBAR_ITEMS } from "./navItems";
import SyncStatus from "./SyncStatus";

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-bark md:flex">
      <div className="px-5 pb-6 pt-7">
        <Brand />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {SIDEBAR_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-bark-active text-white" : "text-[#d9ccb4] hover:bg-bark-active/60"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-bark-active px-3 py-4">
        <SyncStatus />
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-[#d9ccb4] hover:bg-bark-active"
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
    </aside>
  );
}
