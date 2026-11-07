import Brand from "./Brand";
import SyncStatus from "./SyncStatus";

export default function MobileTopBar() {
  return (
    <header className="safe-top sticky top-0 z-30 bg-bark md:hidden">
      <div className="flex items-center justify-between px-4 py-2.5">
        <Brand compact />
        <SyncStatus />
      </div>
    </header>
  );
}
