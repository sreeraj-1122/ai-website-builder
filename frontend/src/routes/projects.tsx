import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useProjects } from "@/lib/projects-store";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — Lumen" }, { name: "description", content: "All your Lumen projects in one place." }] }),
  component: Projects,
});

function Projects() {
  const projects = useProjects((s) => s.projects);
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">All projects</h1>
        <p className="text-muted-foreground mt-1">{projects.length} total</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {projects.map((p) => (
            <motion.div key={p.id} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="rounded-2xl border bg-card shadow-soft overflow-hidden">
              <Link to="/editor/$id" params={{ id: p.id }}>
                <div className={`h-28 bg-gradient-to-br ${p.thumbColor} relative`}><div className="absolute inset-0 grid-bg opacity-30" /></div>
                <div className="p-4">
                  <div className="font-semibold truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate mt-1">{p.prompt}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
