import { useState, useEffect } from "react";
import { RouterProvider, useNavigate } from "react-router";
import { createRouter } from "./routes";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [router, setRouter] = useState<ReturnType<typeof createRouter> | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("isAdminAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  useEffect(() => {
    // Create router with authentication handler
    const handleLogin = () => {
      setIsAuthenticated(true);
    };

    setRouter(createRouter(handleLogin));
  }, []);

  if (!router) {
    return null;
  }

  return <RouterProvider router={router} />;
}

export default App;
