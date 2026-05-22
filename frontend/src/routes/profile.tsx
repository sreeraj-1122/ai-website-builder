import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button, TextField } from "@mui/material";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Lumen" }, { name: "description", content: "Your Lumen profile." }] }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-glow" />
            <div>
              <div className="text-xl font-semibold">Alex Rivera</div>
              <div className="text-sm text-muted-foreground">alex@lumen.app · Pro plan</div>
              <Button size="small" sx={{ mt: 1 }} variant="outlined">Change photo</Button>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Saved"); }} className="grid sm:grid-cols-2 gap-4 mt-8">
            <TextField size="small" label="First name" defaultValue="Alex" />
            <TextField size="small" label="Last name" defaultValue="Rivera" />
            <TextField size="small" label="Email" defaultValue="alex@lumen.app" sx={{ gridColumn: "1 / -1" }} />
            <TextField size="small" label="Bio" multiline rows={3} defaultValue="Building beautiful interfaces, faster." sx={{ gridColumn: "1 / -1" }} />
            <div className="sm:col-span-2">
              <Button type="submit" variant="contained" sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>Save changes</Button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
