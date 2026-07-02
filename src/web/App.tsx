import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { UsersPage } from "./pages/Users";
import { UserDetailPage } from "./pages/UserDetail";
import { OrganizationsPage } from "./pages/Organizations";
import { OrganizationDetailPage } from "./pages/OrganizationDetail";
import { ProjectsPage } from "./pages/Projects";
import { ProjectDetailPage } from "./pages/ProjectDetail";
import { AppsPage } from "./pages/Apps";
import { AppDetailPage } from "./pages/AppDetail";
import { SessionsPage } from "./pages/Sessions";
import { SettingsPage } from "./pages/Settings";
import { WebKeysPage } from "./pages/WebKeys";
import { InstancesPage } from "./pages/Instances";
import type { ReactNode } from "react";

function Protected({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="orgs" element={<OrganizationsPage />} />
        <Route path="orgs/:id" element={<OrganizationDetailPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="apps/:id" element={<AppDetailPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="webkeys" element={<WebKeysPage />} />
        <Route path="instances" element={<InstancesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
