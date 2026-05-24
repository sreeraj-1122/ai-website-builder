import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — GenWeb.ai" }, { name: "description", content: "All your GenWeb.ai projects in one place." }] }),
  component: Projects,
});

function Projects() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/api/website/get-all");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">All projects</h1>
        <p className="text-muted-foreground mt-1">{isLoading ? "Loading..." : `${projects.length} total`}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {projects.map((p: any) => (
            <motion.div key={p._id} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="rounded-2xl border bg-card shadow-soft overflow-hidden">
              <Link to="/editor/$id" params={{ id: p._id }} className="block">
                <div className="h-28 bg-muted relative overflow-hidden border-b">
                  {p.latestCode ? (
                    <iframe
                      title={`${p.title || "Project"} preview`}
                      srcDoc={p.latestCode}
                      sandbox="allow-scripts"
                      className="absolute left-0 top-0 h-[400px] w-[1280px] origin-top-left scale-[0.22] pointer-events-none bg-white"
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="font-semibold truncate">{p.title || "Untitled site"}</div>
                  <div className="text-xs text-muted-foreground truncate mt-1">
                    {p.conversation?.find((m: any) => m.role === "user")?.content || "No description"}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
