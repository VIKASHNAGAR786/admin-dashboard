import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export const createRouter = (onLogin: () => void) => {
  return createBrowserRouter([
    {
      path: "/",
      element: <LoginPage onLogin={onLogin} />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
};
