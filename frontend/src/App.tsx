import { type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Public from "./pages/Public";
import Reviews from "./pages/Reviews";
import Properties from "./pages/properties/Properties";
import PropertyDetails from "./pages/properties/PropertyDetails";

function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (!auth) return <Navigate to="/reviews" replace />;

  if (!auth.user) return <Navigate to="/reviews" replace />;

  return children;
}

function RootRedirect() {
  const auth = useAuth();

  if (auth === null) return null;

  return auth.user ? (
    <Navigate to="/dashboard/management/reviews" replace />
  ) : (
    <Navigate to="/properties" replace />
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/properties"
        element={
          <Layout>
            <Public />
          </Layout>
        }
      />
      <Route
        path="/dashboard/management/reviews"
        element={
          <RequireAuth>
            <Layout>
              <Reviews />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/management/properties"
        element={
          <RequireAuth>
            <Layout>
              <Properties />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/management/properties/:slug"
        element={
          <RequireAuth>
            <Layout>
              <PropertyDetails />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  );
}

export default App;
