import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/dialog";
import { Menu, LayoutDashboard, Users, Building2, Key, Shield, Settings, Globe, Server, LogOut } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/orgs", icon: Building2, label: "Organizations" },
  { to: "/projects", icon: Key, label: "Projects" },
  { to: "/apps", icon: Shield, label: "Applications" },
  { to: "/sessions", icon: Globe, label: "Sessions" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/webkeys", icon: Key, label: "Web Keys" },
  { to: "/instances", icon: Server, label: "Instances" },
];

export function Layout() {
  const { auth, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold text-sm">ZITADEL Console</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
                isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground truncate mb-2">
          {auth?.apiUrl?.replace(/^https?:\/\//, "")}
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="flex h-14 items-center border-b px-4 md:hidden sticky top-0 bg-background z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-sm">ZITADEL Console</span>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 border-r bg-sidebar min-h-screen flex-col sticky top-0 h-screen">
          <NavContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
