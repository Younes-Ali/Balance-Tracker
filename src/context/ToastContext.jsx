import { createContext, useCallback, useContext, useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { newId } from "../lib/format";

const ToastContext = createContext(null);

const STYLES = {
  success: "bg-olive text-white",
  error: "bg-rust text-white",
  warning: "bg-honey text-white",
};
const ICONS = { success: CheckCircle2, error: XCircle, warning: AlertTriangle };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "success") => {
    const id = newId();
    setToasts((list) => [...list, { id, message, type }].slice(-2));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || CheckCircle2;
          return (
            <div
              key={t.id}
              role="status"
              className={`flex max-w-md items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${STYLES[t.type] || STYLES.success}`}
            >
              <Icon size={16} className="shrink-0" />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
