import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Button, Chip } from "@mui/material";
import {
  Sparkles, Zap, Code2, Wand2, Layers, Palette, Globe, Lock, ArrowRight,
  Monitor, Tablet, Smartphone, Check, MessageSquare, Github,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useProjects } from "@/lib/projects-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GenWeb.ai — AI Website Builder" },
      { name: "description", content: "Build modern websites instantly using AI prompts. Generate responsive, production-ready websites with live preview and editable code." },
      { property: "og:title", content: "GenWeb.ai — AI Website Builder" },
      { property: "og:description", content: "Turn ideas into beautiful websites in seconds. From prompt to production-ready." },
    ],
  }),
  component: Landing,
});

const SUGGESTIONS = [
  "Create a fintech landing page",
  "Build a portfolio for a photographer",
  "Create an AI SaaS homepage",
  "Build a modern agency website",
  "Pricing page with 3 tiers",
];

const TYPING_PROMPTS = [
  "Create a modern SaaS landing page…",
  "Build a portfolio for a photographer…",
  "Design a fintech dashboard…",
  "Make an ecommerce homepage…",
];

function useTypingPlaceholder() {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  useEffect(() => {
    const full = TYPING_PROMPTS[i];
    let j = 0;
    const typing = setInterval(() => {
      j++;
      setText(full.slice(0, j));
      if (j >= full.length) {
        clearInterval(typing);
        setTimeout(() => setI((i + 1) % TYPING_PROMPTS.length), 1800);
      }
    }, 45);
    return () => clearInterval(typing);
  }, [i]);
  return text;
}

function Landing() {
  const [prompt, setPrompt] = useState("");
  const typing = useTypingPlaceholder();
  const create = useProjects((s) => s.create);
  const navigate = useNavigate();

  const submit = (text?: string) => {
    const p = (text ?? prompt).trim();
    if (!p) return;
    const project = create(p);
    navigate({ to: "/editor/$id", params: { id: project.id } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Chip
              icon={<Sparkles size={14} />}
              label="Trusted by 10,000+ creators"
              size="small"
              sx={{ background: "color-mix(in oklab, var(--accent) 12%, transparent)", border: "1px solid", borderColor: "divider", fontWeight: 500 }}
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]"
          >
            Turn ideas into beautiful{" "}
            <span className="text-gradient">websites in seconds.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            GenWeb.ai transforms simple prompts into fully responsive, production-ready
            websites with live preview and editable code.
          </motion.p>

          {/* PROMPT BOX */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-10 mx-auto max-w-2xl"
          >
            <div className="glass rounded-2xl p-2 shadow-elegant">
              <div className="flex items-center gap-2 rounded-xl bg-background/60 px-4 py-3">
                <Wand2 size={18} className="text-muted-foreground shrink-0" />
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder={typing + "▍"}
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
                />
                <Button
                  onClick={() => submit()}
                  variant="contained"
                  endIcon={<ArrowRight size={16} />}
                  sx={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 8px 24px -8px rgba(139,92,246,.5)" }}
                >
                  Start Building Free
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="text-xs px-3 py-1.5 rounded-full border bg-card/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* HERO PREVIEW MOCK */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <PreviewMock />
          </motion.div>
        </div>
      </section>

      {/* LOGOS */}
      <section className="border-y bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-6 items-center text-muted-foreground">
          {["Acme", "Nimbus", "Vector", "Forge", "Lumen"].map((n) => (
            <div key={n} className="text-center font-semibold tracking-tight opacity-70 hover:opacity-100 transition">{n}</div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="Features"
          title="A development environment that thinks."
          subtitle="Every primitive you need to design, edit, and ship — wrapped in a delightful, fast interface."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group p-6 rounded-2xl border bg-card shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl grid place-items-center bg-brand text-white shadow-glow">
                <f.icon size={20} />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section className="bg-surface border-y">
        <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              eyebrow="AI Demo"
              title="Refine with a sentence."
              subtitle="Chat directly with your project. Lumen edits the code, updates the preview, and explains what changed."
              align="left"
            />
            <ul className="mt-8 space-y-3">
              {["Change navbar color to violet", "Add a pricing section with 3 tiers", "Make it feel more like Linear"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <Check size={18} className="mt-0.5 text-[color:var(--accent)]" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card shadow-elegant p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <MessageSquare size={14} /> AI Assistant
            </div>
            <div className="space-y-3 text-sm">
              <ChatBubble role="user">Make the hero feel more premium.</ChatBubble>
              <ChatBubble role="ai">Updated the hero: softer radial gradient, larger display font, and a subtle floating screenshot. Want me to add testimonials next?</ChatBubble>
              <ChatBubble role="user">Yes — three short ones.</ChatBubble>
              <div className="px-4 py-3 rounded-xl bg-muted/50">
                <div className="h-2 rounded shimmer" />
                <div className="h-2 rounded shimmer mt-2 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader eyebrow="Loved by builders" title="What teams are saying." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl border bg-card shadow-soft">
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color}`} />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-surface border-y">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <SectionHeader eyebrow="Pricing" title="Simple, transparent pricing." subtitle="Start free. Upgrade when you ship." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`p-7 rounded-2xl border bg-card relative ${p.featured ? "shadow-elegant ring-1 ring-[color:var(--accent)]" : "shadow-soft"}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-brand text-white shadow-glow">
                    Most popular
                  </div>
                )}
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                  {p.price !== "Custom" && <span className="text-muted-foreground text-sm">/mo</span>}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <Link to="/signup">
                  <Button fullWidth variant={p.featured ? "contained" : "outlined"} sx={p.featured ? { mt: 3, background: "linear-gradient(135deg,#6366f1,#a855f7)" } : { mt: 3 }}>
                    Get started
                  </Button>
                </Link>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><Check size={16} className="text-[color:var(--accent)] mt-0.5" />{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions." />
        <div className="mt-10 divide-y border rounded-2xl bg-card">
          {FAQ.map((q) => <FAQItem key={q.q} {...q} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border bg-card shadow-elegant p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-hero opacity-60 pointer-events-none" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to build something <span className="text-gradient">beautiful</span>?</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Start with a prompt. Ship in minutes.</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/signup"><Button variant="contained" size="large" sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}>Start free</Button></Link>
              <Link to="/dashboard"><Button variant="outlined" size="large" startIcon={<Github size={16} />}>Open dashboard</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const FEATURES = [
  { icon: Wand2, title: "Prompt to product", desc: "Generate complete sites — pages, components, copy — from one sentence." },
  { icon: Code2, title: "Editable code", desc: "Real Monaco editor with multi-file support. Tweak, refactor, own it." },
  { icon: Zap, title: "Instant preview", desc: "Hot-reloading sandbox renders your site in real time, across devices." },
  { icon: MessageSquare, title: "AI partner", desc: "Iterate via chat. \"Make the hero bolder.\" \"Add a CTA.\" Done." },
  { icon: Palette, title: "Beautiful by default", desc: "Curated typography, color, and motion — no generic templates." },
  { icon: Globe, title: "One-click export", desc: "Download a clean React/Vite project or deploy in a single click." },
];

const TESTIMONIALS = [
  { name: "Aria Chen", role: "Founder, Northbound", quote: "Lumen replaced our design phase. We shipped a landing page in 40 minutes that looked better than our last agency build.", color: "from-indigo-500 to-fuchsia-500" },
  { name: "Marcus Hale", role: "Engineering Lead", quote: "The code is genuinely clean. I exported and dropped it straight into our repo with zero rewrites.", color: "from-amber-400 to-rose-500" },
  { name: "Priya Raman", role: "Indie Hacker", quote: "Feels like pairing with a senior designer who actually types fast.", color: "from-emerald-400 to-cyan-500" },
];

const PLANS = [
  { name: "Starter", price: "$0", desc: "For tinkering and side projects.", featured: false, features: ["10 generations / mo", "Public projects", "Community support"] },
  { name: "Pro", price: "$24", desc: "For makers shipping real products.", featured: true, features: ["Unlimited generations", "Private projects", "Export to GitHub", "Priority AI"] },
  { name: "Team", price: "Custom", desc: "Collaboration for teams.", featured: false, features: ["Everything in Pro", "Realtime collaboration", "Role permissions", "Dedicated support"] },
];

const FAQ = [
  { q: "How does Lumen generate websites?", a: "You describe the site, and our AI plans the structure, writes the code, and previews it live. You can refine via chat or edit the code directly." },
  { q: "Do I own the code?", a: "Yes. Every project exports as a clean React + Vite codebase. There is no vendor lock-in." },
  { q: "Can I deploy from Lumen?", a: "One-click deploy is available on Pro and Team plans, or export the ZIP and host anywhere." },
  { q: "Is there a free tier?", a: "Yes — the Starter plan is free forever and includes 10 generations per month." },
];

function SectionHeader({ eyebrow, title, subtitle, align = "center" }: { eyebrow: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-xl"}>
      <div className="text-xs uppercase tracking-widest text-[color:var(--accent)] font-semibold">{eyebrow}</div>
      <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function ChatBubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${role === "user" ? "bg-brand text-white" : "bg-muted"}`}>{children}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left p-5 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">{q}</span>
        <span className={`transition-transform text-muted-foreground ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </button>
  );
}

function PreviewMock() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const width = device === "desktop" ? "100%" : device === "tablet" ? 640 : 320;
  return (
    <div className="rounded-2xl border bg-card shadow-elegant overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-surface">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <span className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <div className="text-xs text-muted-foreground glass px-3 py-1 rounded-md">lumen.app/preview</div>
        <div className="flex gap-1">
          {[{ i: Monitor, k: "desktop" }, { i: Tablet, k: "tablet" }, { i: Smartphone, k: "mobile" }].map(({ i: Icon, k }) => (
            <button key={k} onClick={() => setDevice(k as any)} className={`p-1.5 rounded-md transition ${device === k ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
      <div className="bg-surface p-6 flex justify-center">
        <motion.div
          layout
          transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
          style={{ width }}
          className="rounded-xl overflow-hidden border bg-background shadow-soft floaty"
        >
          <div className="h-10 border-b flex items-center px-4 gap-3 text-xs text-muted-foreground">
            <Layers size={12} /> Generated preview
          </div>
          <div className="p-8 md:p-14 bg-hero">
            <div className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-widest text-[color:var(--accent)] border border-[color:var(--accent)]/30 rounded-full">v1.0</div>
            <div className="mt-4 text-2xl md:text-4xl font-bold tracking-tight leading-tight">Productivity, <span className="text-gradient">reimagined.</span></div>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground">Ship beautiful interfaces in minutes with AI that understands taste.</p>
            <div className="mt-5 flex gap-2">
              <div className="px-3 py-1.5 rounded-md bg-brand text-white text-xs font-medium">Start free</div>
              <div className="px-3 py-1.5 rounded-md border text-xs">Watch demo</div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[1,2,3].map(i => <div key={i} className="h-16 rounded-lg border bg-card" />)}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
