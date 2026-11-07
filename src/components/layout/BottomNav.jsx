import { NavLink, useLocation } from "react-router-dom";
import { TAB_ITEMS } from "./navItems";

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card md:hidden">
      <div className="grid grid-cols-5">
        {TAB_ITEMS.map(({ to, label, icon: Icon, end, alsoActive }) => {
          const forced = alsoActive && alsoActive.some((p) => pathname.startsWith(p));
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                  isActive || forced ? "text-honey-dark" : "text-muted"
                }`
              }
            >
              <Icon size={21} />
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
