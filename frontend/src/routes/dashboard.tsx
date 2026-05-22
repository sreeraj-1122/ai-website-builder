import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useProjects } from "@/lib/projects-store";
import { Button, Menu, MenuItem, IconButton, TextField } from "@mui/material";
import { Wand2, MoreHorizontal, Sparkles, ArrowRight, Plus, TrendingUp, Clock, Folder } from "lucide-react";
import { motion } from "framer-motion";
import { useState, MouseEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Lumen" }, { name: "description", content: "Your Lumen projects and recent activity." }] }),
  component: Dashboard,
});

const SUGGESTIONS = [
  "SaaS landing page",
  "Photographer portfolio",
  "Ecommerce homepage",
  "Modern dashboard",
];

function Dashboard() {
  const projects = useProjects((s) => s.projects);
  const create = useProjects((s) => s.create);
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const submit = (text?: string) => {
    const t = (text ?? prompt).trim();
    if (!t) return;
    const p = create(t);
    navigate({ to: "/editor/$id", params: { id: p.id } });
  };

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
        {/* HERO PROMPT */}
        <section>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Good evening, Alex.</h1>
              <p className="text-muted-foreground mt-1">What are we building today?</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-6 glass rounded-2xl p-2 shadow-elegant">
            <div className="flex items-center gap-2 rounded-xl bg-background/60 px-4 py-3">
              <Wand2 size={18} className="text-muted-foreground" />
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Describe the website you want to build…"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
              <Button onClick={() => submit()} variant="contained" endIcon={<ArrowRight size={16} />} sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>
                Generate
              </Button>
            </div>
          </motion.div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => submit(s)} className="text-xs px-3 py-1.5 rounded-full border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Sparkles size={12} className="inline mr-1.5 -mt-0.5" />{s}
              </button>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="grid sm:grid-cols-3 gap-4">
          <Stat icon={Folder} label="Projects" value={projects.length.toString()} hint="+2 this week" />
          <Stat icon={Sparkles} label="AI generations" value="148" hint="of 500 / mo" progress={148/500} />
          <Stat icon={TrendingUp} label="Avg. ship time" value="12m" hint="-23% vs last month" />
        </section>

        {/* PROJECTS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Recent projects</h2>
            <Button startIcon={<Plus size={16} />} size="small" onClick={() => submit("Untitled site")}>New</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            <Link to="/dashboard" className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-[color:var(--accent)] hover:bg-muted/30 transition min-h-[220px]">
              <Plus size={24} />
              <div className="mt-2 text-sm font-medium">Start a new project</div>
            </Link>
          </div>
        </section>

        {/* ACTIVITY */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Recent activity</h2>
          <div className="rounded-2xl border bg-card divide-y">
            {[
              ["Generated", "Nimbus SaaS", "30m ago"],
              ["Edited", "Lens Portfolio", "4h ago"],
              ["Exported ZIP", "Forge Commerce", "yesterday"],
              ["Renamed", "Pulse Dashboard", "3d ago"],
            ].map(([action, target, when]) => (
              <div key={action + target} className="flex items-center justify-between px-5 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-muted-foreground" />
                  <span><span className="text-muted-foreground">{action}</span> <span className="font-medium">{target}</span></span>
                </div>
                <span className="text-xs text-muted-foreground">{when}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, hint, progress }: { icon: any; label: string; value: string; hint: string; progress?: number }) {
  return (
    <div className="p-5 rounded-2xl border bg-card shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="w-8 h-8 rounded-lg bg-muted grid place-items-center text-[color:var(--accent)]"><Icon size={16} /></div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-brand" style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: ReturnType<typeof useProjects.getState>["projects"][number] }) {
  const remove = useProjects((s) => s.remove);
  const rename = useProjects((s) => s.rename);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(project.name);

  const open = (e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); e.stopPropagation(); setAnchor(e.currentTarget); };
  const close = () => setAnchor(null);

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="group rounded-2xl border bg-card shadow-soft hover:shadow-elegant transition-all overflow-hidden">
      <Link to="/editor/$id" params={{ id: project.id }} className="block">
        <div className={`h-32 bg-gradient-to-br ${project.thumbColor} relative`}>
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute bottom-3 left-3 text-white/90 text-xs font-medium tracking-wide">Preview</div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            {renaming ? (
              <TextField
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") { rename(project.id, name); setRenaming(false); toast.success("Renamed"); }
                  if (e.key === "Escape") { setRenaming(false); setName(project.name); }
                }}
                autoFocus
                fullWidth
              />
            ) : (
              <div className="font-semibold tracking-tight truncate">{project.name}</div>
            )}
            <IconButton size="small" onClick={open}><MoreHorizontal size={16} /></IconButton>
          </div>
          <div className="text-xs text-muted-foreground mt-1 truncate">{project.prompt}</div>
          <div className="text-[11px] text-muted-foreground mt-3">{timeAgo(project.updatedAt)}</div>
        </div>
      </Link>
      <Menu anchorEl={anchor} open={!!anchor} onClose={close}>
        <MenuItem onClick={() => { setRenaming(true); close(); }}>Rename</MenuItem>
        <MenuItem onClick={() => { navigator.clipboard?.writeText(JSON.stringify(project.files)); toast.success("Copied"); close(); }}>Copy code</MenuItem>
        <MenuItem onClick={() => { remove(project.id); toast.success("Deleted"); close(); }} sx={{ color: "error.main" }}>Delete</MenuItem>
      </Menu>
    </motion.div>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
