import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "./navbar";
import { ThemeToggle } from "./theme-toggle";
import { LayoutDashboard, FolderKanban, Settings, User, CreditCard, Sparkles, LogOut, Search } from "lucide-react";
import { Button, IconButton, Tooltip } from "@mui/material";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar sticky top-0 h-screen">
        <div className="p-5 border-b">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="px-3 py-3">
          <Link to="/dashboard">
            <Button fullWidth variant="contained" startIcon={<Sparkles size={16} />} sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", boxShadow: "0 8px 24px -8px rgba(139,92,246,.5)" }}>
              New project
            </Button>
          </Link>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {items.map((it) => {
            const active = path === it.to || (it.to !== "/dashboard" && path.startsWith(it.to));
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
              >
                <it.icon size={16} /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">Alex Rivera</div>
              <div className="text-xs text-muted-foreground truncate">alex@lumen.app</div>
            </div>
          </div>
          <Tooltip title="Sign out">
            <IconButton size="small"><LogOut size={14} /></IconButton>
          </Tooltip>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 glass h-14 flex items-center justify-between px-5 border-b">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card">
              <Search size={14} /> <span>Search</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border bg-muted">⌘K</kbd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle size="small" />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
