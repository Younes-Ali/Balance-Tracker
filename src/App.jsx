import { useCallback } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import AboutPage from "./pages/AboutPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ClientsPage from "./pages/ClientsPage";
import LoginPage from "./pages/LoginPage";
import MorePage from "./pages/MorePage";
import OrdersPage from "./pages/OrdersPage";
import SummaryPage from "./pages/SummaryPage";
import VodafonePage from "./pages/VodafonePage";

function Authenticated() {
  const { session, api, logout } = useAuth();
  const onUnauthorized = useCallback(() => logout(), [logout]);
  if (!session) return <LoginPage />;
  return (
    <DataProvider api={api} onUnauthorized={onUnauthorized}>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<SummaryPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/vodafone" element={<VodafonePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Authenticated />
      </AuthProvider>
    </ToastProvider>
  );
}
