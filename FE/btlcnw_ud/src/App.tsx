import { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { AppProvider } from "./context/AppContext";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";
import TablesPage from "./pages/TablesPage";
import "./assets/styles/app.css";

const hasAuthenticatedUser = (): boolean => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return false;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as { id?: string };
    return Boolean(parsedUser?.id);
  } catch {
    return false;
  }
};

const getCurrentUserRole = (): string => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return "";
  }

  try {
    const parsedUser = JSON.parse(rawUser) as { role?: string };
    return (parsedUser.role ?? "").trim().toLowerCase();
  } catch {
    return "";
  }
};

const RequireAuth = ({ children }: { children: ReactElement }) => {
  if (!hasAuthenticatedUser()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RedirectIfAuthenticated = ({ children }: { children: ReactElement }) => {
  if (hasAuthenticatedUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const RequireRole = ({
  children,
  allowedRoles
}: {
  children: ReactElement;
  allowedRoles: string[];
}) => {
  const role = getCurrentUserRole();
  const normalizedAllowedRoles = allowedRoles.map((item) => item.toLowerCase());

  if (!normalizedAllowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/products" element={<Navigate to="/menu" replace />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route
              path="/inventory"
              element={
                <RequireRole allowedRoles={["Admin"]}>
                  <InventoryPage />
                </RequireRole>
              }
            />
            <Route
              path="/employees"
              element={
                <RequireRole allowedRoles={["Admin"]}>
                  <EmployeesPage />
                </RequireRole>
              }
            />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to={hasAuthenticatedUser() ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;