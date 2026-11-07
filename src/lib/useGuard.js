import { useCallback } from "react";
import { useToast } from "../context/ToastContext";

export function useGuard() {
  const toast = useToast();
  return useCallback(
    async (fn, successMessage) => {
      try {
        await fn();
        if (successMessage) toast(successMessage, "success");
        return true;
      } catch (err) {
        toast(err.message || "Something went wrong", "error");
        return false;
      }
    },
    [toast]
  );
}
