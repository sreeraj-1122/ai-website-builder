import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button, Switch, TextField, Divider } from "@mui/material";
import { useTheme } from "@/lib/theme-store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Lumen" }, { name: "description", content: "Manage your account preferences." }] }),
  component: Settings,
});

function Settings() {
  const { theme, set } = useTheme();
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Preferences and account.</p>
        </div>

        <Card title="Appearance" desc="Choose how Lumen looks to you.">
          <div className="flex items-center justify-between">
            <div className="text-sm">Dark mode</div>
            <Switch checked={theme === "dark"} onChange={(_, v) => set(v ? "dark" : "light")} />
          </div>
        </Card>

        <Card title="Workspace" desc="Workspace-level defaults.">
          <TextField fullWidth size="small" label="Workspace name" defaultValue="Lumen Labs" sx={{ mb: 2 }} />
          <TextField fullWidth size="small" label="Default project framework" defaultValue="React + Vite" />
        </Card>

        <Card title="Notifications" desc="What we ping you about.">
          {["Product updates", "AI generation finished", "Weekly digest"].map((l, i) => (
            <div key={l} className="flex items-center justify-between py-2">
              <div className="text-sm">{l}</div>
              <Switch defaultChecked={i !== 2} />
            </div>
          ))}
        </Card>

        <Card title="Danger zone" desc="Irreversible actions." danger>
          <Button color="error" variant="outlined" onClick={() => toast.error("Demo only")}>Delete account</Button>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ title, desc, children, danger }: { title: string; desc: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-card p-6 ${danger ? "border-destructive/30" : ""}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
      <Divider sx={{ my: 2 }} />
      {children}
    </div>
  );
}
