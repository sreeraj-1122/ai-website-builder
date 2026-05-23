import { Link, useRouterState } from "@tanstack/react-router";
import { Button, Avatar, Menu, MenuItem, Divider, Chip, IconButton, Drawer } from "@mui/material";
import { Sparkles, Settings as SettingsIcon, CreditCard, LogOut, User as UserIcon, Zap, Menu as MenuIcon, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@/lib/user-store";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="grid place-items-center rounded-xl bg-brand shadow-glow"
        style={{ width: size + 10, height: size + 10 }}
      >
        <Sparkles size={size - 6} color="white" />
      </div>
      <span className="font-semibold tracking-tight text-lg">GenWeb<span className="text-gradient">.ai</span></span>
    </div>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobile, setMobile] = useState(false);
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted ${path === n.to ? "text-foreground" : "text-muted-foreground"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <ProfileMenu />
          </div>
          <IconButton className="md:!hidden" onClick={() => setMobile(true)} size="small">
            <MenuIcon size={20} />
          </IconButton>
        </div>
      </div>

      <Drawer anchor="right" open={mobile} onClose={() => setMobile(false)} slotProps={{ paper: { sx: { width: 280 } } }}>
        <div className="p-4 flex items-center justify-between border-b">
          <Logo />
          <IconButton size="small" onClick={() => setMobile(false)}><X size={18} /></IconButton>
        </div>
        <div className="p-4 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setMobile(false)} className={`px-3 py-2.5 rounded-lg text-sm hover:bg-muted ${path === n.to ? "bg-muted text-foreground" : "text-muted-foreground"}`}>
              {n.label}
            </Link>
          ))}
          <Divider sx={{ my: 2 }} />
          <ProfileMenu compact />
        </div>
      </Drawer>
    </motion.header>
  );
}

function ProfileMenu({ compact = false }: { compact?: boolean }) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const { user, signOut } = useUser();
  const open = Boolean(anchor);

  const handleSignOut = async () => {
    try {
      await api.get("/api/auth/logout");
      signOut();
      setAnchor(null);
      toast.success("Signed out successfully");
    } catch (e) {
      toast.error("Failed to sign out");
    }
  };

  if (!user) {
    return (
      <Link to="/login">
        <Button variant="contained" size={compact ? "medium" : "small"} fullWidth={compact} sx={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", borderRadius: 8 }}>
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={(e) => setAnchor(e.currentTarget)}
        className={`flex items-center gap-2 rounded-full border bg-card/60 backdrop-blur hover:bg-muted transition-colors ${compact ? "w-full justify-start p-2" : "pl-1 pr-2 py-1"}`}
      >
        <Avatar src={user.image || user.avatar} sx={{ width: 30, height: 30 }} />
        {compact && (
          <div className="text-left">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.email}</div>
          </div>
        )}
      </button>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.2,
              minWidth: 280,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              background: "color-mix(in oklab, var(--popover) 85%, transparent)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 20px 60px -20px rgba(0,0,0,0.25)",
              overflow: "hidden",
            },
          },
        }}
      >
        <div className="p-4 flex items-center gap-3 border-b">
          <Avatar src={user.image || user.avatar} sx={{ width: 44, height: 44 }} />
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap size={13} className="text-[color:var(--accent)]" />
            Credits
          </div>
          <span className="text-sm font-semibold tabular-nums">{user.credits || 0}</span>
        </div>
        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Plan</span>
          <Chip
            size="small"
            label={user.planType || user.plan || "Free"}
            sx={{
              height: 20,
              fontSize: 11,
              fontWeight: 600,
              background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
              color: "white",
            }}
          />
        </div>
        <Divider />
        <MenuItem component={Link} to="/profile" onClick={() => setAnchor(null)} sx={{ gap: 1.2, fontSize: 14 }}>
          <UserIcon size={16} /> Profile
        </MenuItem>
        <MenuItem component={Link} to="/settings" onClick={() => setAnchor(null)} sx={{ gap: 1.2, fontSize: 14 }}>
          <SettingsIcon size={16} /> Settings
        </MenuItem>
        <MenuItem component={Link} to="/pricing" onClick={() => setAnchor(null)} sx={{ gap: 1.2, fontSize: 14 }}>
          <CreditCard size={16} /> Billing
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleSignOut}
          sx={{ gap: 1.2, fontSize: 14, color: "var(--destructive)" }}
        >
          <LogOut size={16} /> Log out
        </MenuItem>
        <div className="px-4 pt-2 pb-3">
          <Link to="/signup" onClick={() => setAnchor(null)}>
            <Button fullWidth size="small" variant="contained" sx={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)" }}>
              Upgrade plan
            </Button>
          </Link>
        </div>
      </Menu>
    </>
  );
}
