import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function Layout() {
  const { auth, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>ZITADEL Console</h1>
          <div className="sub">{auth?.apiUrl?.replace(/^https?:\/\//, "")}</div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/orgs">Organizations</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/apps">Applications</NavLink>
          <NavLink to="/sessions">Sessions</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <NavLink to="/webkeys">Web Keys</NavLink>
          <NavLink to="/instances">Instances</NavLink>
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Connected</div>
          <button className="logout-btn" onClick={logout}>Disconnect</button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
