import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button, Chip, InputBase } from "@mui/material";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Search, TrendingUp, Eye, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { TEMPLATES, TEMPLATE_CATEGORIES, type Template } from "@/data/templates";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — GenWeb.ai" },
      { name: "description", content: "Production-ready website templates for SaaS, portfolio, ecommerce, dashboards, and more. Start from a template and customize with AI." },
      { property: "og:title", content: "Templates — GenWeb.ai" },
      { property: "og:description", content: "Beautiful, AI-customizable starting points for any website." },
      { property: "og:url", content: "/templates" },
    ],
    links: [{ rel: "canonical", href: "/templates" }],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (!q) return true;
      const hay = `${t.name} ${t.description} ${t.tags.join(" ")} ${t.category}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [cat, q]);

  const trending = useMemo(() => TEMPLATES.filter((t) => t.trending), []);
  const recent = useMemo(() => [...TEMPLATES].sort((a, b) => b.uses - a.uses).slice(0, 3), []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 text-center">
          <Chip icon={<Sparkles size={14} />} label={`${TEMPLATES.length}+ premium templates`} size="small" sx={{ background: "color-mix(in oklab, var(--accent) 12%, transparent)", border: "1px solid", borderColor: "divider" }} />
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">Start from a <span className="text-gradient">template.</span></h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Production-ready starting points across SaaS, portfolio, ecommerce, dashboards and more. Customize with AI in seconds.</p>

          <div className="mt-7 max-w-xl mx-auto flex items-center gap-2 rounded-2xl border bg-card/80 backdrop-blur shadow-soft px-4 py-3">
            <Search size={18} className="text-muted-foreground" />
            <InputBase
              fullWidth
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates by name, tag, or category…"
              sx={{ fontSize: 14 }}
            />
          </div>
        </div>
      </section>

      {/* Trending */}
      {!q && cat === "All" && (
        <section className="mx-auto max-w-7xl px-6 pt-12 w-full">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[color:var(--accent)]" />
            <h2 className="text-lg font-semibold tracking-tight">Trending this week</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((t, i) => <TemplateCard key={t.slug} t={t} i={i} highlight />)}
          </div>
        </section>
      )}

      {/* Recent */}
      {!q && cat === "All" && (
        <section className="mx-auto max-w-7xl px-6 pt-10 w-full">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={18} className="text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">Most used</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((t, i) => <TemplateCard key={t.slug} t={t} i={i} />)}
          </div>
        </section>
      )}

      {/* All */}
      <section className="mx-auto max-w-7xl px-6 py-12 pt-14 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-tight">All templates</h2>
          <div className="text-xs text-muted-foreground">{filtered.length} results</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${cat === c ? "bg-foreground text-background border-foreground" : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-card p-16 text-center">
            <div className="text-4xl">🔍</div>
            <div className="mt-3 font-semibold">No templates found</div>
            <div className="mt-1 text-sm text-muted-foreground">Try a different keyword or category.</div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t, i) => <TemplateCard key={t.slug} t={t} i={i} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function TemplateCard({ t, i, highlight = false }: { t: Template; i: number; highlight?: boolean }) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const use = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await api.post("/api/website/generate", { prompt: t.prompt });
      const websiteId = res.data.website?._id || res.data.websiteId;
      if (websiteId) {
        navigate({ to: "/editor/$id", params: { id: websiteId } });
      }
    } catch {
      toast.error("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col bg-card shadow-soft hover:shadow-elegant transition-all"
    >
      {/* Gradient border */}
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-100 transition-opacity blur-[1px] -z-10`} />
      <div className="rounded-2xl border bg-card overflow-hidden flex flex-col h-full">
        <div className="relative h-44 overflow-hidden">
          <img
            src={t.cover}
            alt={t.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${t.accent} opacity-40 mix-blend-multiply`} />
          <div className="absolute top-3 left-3 flex gap-2">
            <Chip
              size="small"
              label={t.category}
              sx={{ height: 22, fontSize: 11, background: "rgba(0,0,0,0.55)", color: "white", backdropFilter: "blur(6px)" }}
            />
            {highlight && (
              <Chip
                size="small"
                icon={<TrendingUp size={11} style={{ color: "white" }} />}
                label="Trending"
                sx={{ height: 22, fontSize: 11, background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "white", "& .MuiChip-icon": { color: "white" } }}
              />
            )}
          </div>
          <div className="absolute bottom-3 right-3 text-[11px] text-white/90 flex items-center gap-1 bg-black/40 backdrop-blur px-2 py-1 rounded-full">
            <Eye size={11} /> {t.uses.toLocaleString()}
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="font-semibold tracking-tight">{t.name}</div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {t.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Button disabled size="small" variant="outlined" sx={{ flex: 1 }} startIcon={<Eye size={14} />}>
              Preview
            </Button>
            <Button
              onClick={use}
              disabled={isGenerating}
              size="small"
              variant="contained"
              sx={{ flex: 1, background: "linear-gradient(135deg,#8b5cf6,#06b6d4)" }}
              endIcon={<ArrowRight size={14} />}
            >
              {isGenerating ? "Building" : "Use"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
