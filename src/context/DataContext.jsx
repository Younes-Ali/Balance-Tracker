import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { newId, nowIso, todayIso } from "../lib/format";
import {
  enrichClients,
  orderStats,
  recentTransactions,
  statistics,
  topDebtors,
  vodafoneBalance,
  vodafoneInflows,
} from "../lib/ledger";
import { EMPTY, normalizeSnapshot } from "../lib/normalize";
import { buildOrderRecord } from "../lib/orders";

const CACHE_KEY = "raheeq_cache";
const POLL_MS = 20000;
const FULL_REFRESH_EVERY = 10;

const DataContext = createContext(null);

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Array.isArray(cached.clients) && Array.isArray(cached.transactions)) return cached;
  } catch {
    return null;
  }
  return null;
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    return;
  }
}

export function DataProvider({ api, onUnauthorized, children }) {
  const cached = useMemo(readCache, []);
  const [data, setData] = useState(cached || EMPTY);
  const [status, setStatus] = useState(cached ? "syncing" : "loading");
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const versionRef = useRef(null);
  const seqRef = useRef(0);

  const markOk = useCallback(() => {
    setStatus("ok");
    setError("");
    setLastSync(new Date());
  }, []);

  const load = useCallback(
    async (force) => {
      const seq = seqRef.current;
      try {
        if (!force && versionRef.current !== null) {
          const version = String(await api.version());
          if (version === versionRef.current) {
            markOk();
            return;
          }
        }
        const snapshot = await api.snapshot();
        if (seq !== seqRef.current) return;
        versionRef.current = String(snapshot.version);
        setData(normalizeSnapshot(snapshot));
        markOk();
      } catch (err) {
        if (err.code === "unauthorized") {
          onUnauthorized();
          return;
        }
        setStatus("offline");
        setError(err.message);
      }
    },
    [api, markOk, onUnauthorized]
  );

  useEffect(() => {
    load(true);
    let tick = 0;
    const timer = setInterval(() => {
      if (document.hidden) return;
      tick += 1;
      load(tick % FULL_REFRESH_EVERY === 0);
    }, POLL_MS);
    const wake = () => {
      if (!document.hidden) load(false);
    };
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("online", wake);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("online", wake);
    };
  }, [load]);

  useEffect(() => {
    if (status === "ok") writeCache(data);
  }, [data, status]);

  const refresh = useCallback(() => {
    setStatus((s) => (s === "loading" ? s : "syncing"));
    return load(true);
  }, [load]);

  const mutate = useCallback(
    async (remote, local) => {
      try {
        await remote();
      } catch (err) {
        if (err.code === "unauthorized") onUnauthorized();
        throw err;
      }
      seqRef.current += 1;
      setData(local);
      markOk();
    },
    [markOk, onUnauthorized]
  );

  const actions = useMemo(
    () => ({
      addClient: async ({ name, company, phone, photo }) => {
        const record = { id: newId(), name, company, phone, photo: photo || "", created_at: nowIso() };
        await mutate(
          () => api.upsert("clients", record),
          (d) => ({ ...d, clients: [...d.clients, record] })
        );
        return record;
      },
      updateClient: (id, changes) =>
        mutate(
          () => api.upsert("clients", { id, ...changes }),
          (d) => ({ ...d, clients: d.clients.map((c) => (c.id === id ? { ...c, ...changes } : c)) })
        ),
      removeClient: (id) =>
        mutate(
          () => api.remove("clients", id, [{ sheet: "transactions", field: "client_id" }]),
          (d) => ({
            ...d,
            clients: d.clients.filter((c) => c.id !== id),
            transactions: d.transactions.filter((t) => t.client_id !== id),
          })
        ),
      addCharge: (clientId, description, amount) => {
        const record = {
          id: newId(),
          client_id: clientId,
          type: "charge",
          amount,
          description,
          payment_method: "",
          date: todayIso(),
          timestamp: nowIso(),
        };
        return mutate(
          () => api.upsert("transactions", record),
          (d) => ({ ...d, transactions: [...d.transactions, record] })
        );
      },
      addPayment: (clientId, amount, method, description) => {
        const record = {
          id: newId(),
          client_id: clientId,
          type: "payment",
          amount,
          description: description || "",
          payment_method: method,
          date: todayIso(),
          timestamp: nowIso(),
        };
        return mutate(
          () => api.upsert("transactions", record),
          (d) => ({ ...d, transactions: [...d.transactions, record] })
        );
      },
      removeTransaction: (id) =>
        mutate(
          () => api.remove("transactions", id),
          (d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) })
        ),
      addExpense: (description, amount) => {
        const record = { id: newId(), description, amount, date: todayIso() };
        return mutate(
          () => api.upsert("expenses", record),
          (d) => ({ ...d, expenses: [...d.expenses, record] })
        );
      },
      removeExpense: (id) =>
        mutate(
          () => api.remove("expenses", id),
          (d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) })
        ),
      addOrder: (input) => {
        const record = buildOrderRecord(input, nowIso());
        return mutate(
          () => api.upsert("orders", { ...record, items: JSON.stringify(record.items) }),
          (d) => ({ ...d, orders: [...d.orders, record] })
        );
      },
      patchOrder: (id, fields) => {
        const changes = { ...fields, updated_at: nowIso() };
        return mutate(
          () => api.upsert("orders", { id, ...changes }),
          (d) => ({ ...d, orders: d.orders.map((o) => (o.id === id ? { ...o, ...changes } : o)) })
        );
      },
      removeOrder: (id) =>
        mutate(
          () => api.remove("orders", id),
          (d) => ({ ...d, orders: d.orders.filter((o) => o.id !== id) })
        ),
    }),
    [api, mutate]
  );

  const derived = useMemo(() => {
    const clients = enrichClients(data.clients, data.transactions);
    return {
      clients,
      byId: Object.fromEntries(clients.map((c) => [c.id, c])),
      stats: statistics(clients, data.expenses),
      orderStats: orderStats(data.orders),
      topDebtors: topDebtors(clients, 6),
      recent: recentTransactions(clients, 6),
      inflows: vodafoneInflows(clients),
      vodafoneBalance: vodafoneBalance(clients, data.expenses),
    };
  }, [data]);

  const value = useMemo(
    () => ({ data, derived, status, error, lastSync, refresh, ...actions }),
    [data, derived, status, error, lastSync, refresh, actions]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
