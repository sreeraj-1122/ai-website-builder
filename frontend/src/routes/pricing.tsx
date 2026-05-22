import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@mui/material";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — Lumen" }, { name: "description", content: "Simple, transparent pricing for Lumen." }] }),
  component: Pricing,
});

const PLANS = [
  { name: "Starter", price: "$0", desc: "For tinkering and side projects.", featured: false, features: ["10 generations / mo", "Public projects", "Community support", "Basic export"] },
  { name: "Pro", price: "$24", desc: "For makers shipping real products.", featured: true, features: ["Unlimited generations", "Private projects", "Export to GitHub", "Priority AI", "Custom domains", "Version history"] },
  { name: "Team", price: "Custom", desc: "Collaboration for teams.", featured: false, features: ["Everything in Pro", "Realtime collaboration", "Role permissions", "Dedicated support", "SSO", "Audit logs"] },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="relative">
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <div className="text-xs uppercase tracking-widest text-[color:var(--accent)] font-semibold">Pricing</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">Pricing that scales <span className="text-gradient">with you.</span></h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Start free. Upgrade when you're ready to ship.</p>

          <div className="mt-14 grid gap-5 md:grid-cols-3 text-left">
            {PLANS.map((p) => (
              <div key={p.name} className={`p-8 rounded-2xl border bg-card relative ${p.featured ? "shadow-elegant ring-1 ring-[color:var(--accent)]" : "shadow-soft"}`}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-brand text-white shadow-glow">Most popular</div>}
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight">{p.price}</span>
                  {p.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
                <Link to="/signup">
                  <Button fullWidth variant={p.featured ? "contained" : "outlined"} sx={p.featured ? { mt: 3, background: "linear-gradient(135deg,#6366f1,#a855f7)" } : { mt: 3 }}>
                    {p.price === "Custom" ? "Contact sales" : "Get started"}
                  </Button>
                </Link>
                <ul className="mt-7 space-y-2.5 text-sm">
                  {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-[color:var(--accent)] mt-0.5" />{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
