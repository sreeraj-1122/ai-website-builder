import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@mui/material";
import { Check, Coins, Zap } from "lucide-react";
import { useUser } from "@/lib/user-store";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — GenWeb.ai" },
      { name: "description", content: "Simple, transparent pricing. Buy credits once, build anytime." },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    priceNum: 0,
    credits: 100,
    desc: "Perfect to explore GenWeb.ai",
    featured: false,
    button: "Get Started",
    features: [
      "100 AI generation credits",
      "Responsive HTML output",
      "Basic animations",
      "Community support",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹499",
    priceNum: 499,
    credits: 500,
    desc: "For serious creators & freelancers",
    featured: true,
    button: "Upgrade to Pro",
    features: [
      "500 AI generation credits",
      "Everything in Free",
      "Faster generation",
      "Edit & regenerate",
      "Priority AI access",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹1499",
    priceNum: 1499,
    credits: 1000,
    desc: "For teams & power users",
    featured: false,
    button: "Contact Sales",
    features: [
      "1000 AI generation credits",
      "Unlimited iterations",
      "Highest priority queue",
      "Team collaboration",
      "Dedicated support",
    ],
  },
];

function Pricing() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: (typeof PLANS)[0]) => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (plan.priceNum === 0) {
      navigate({ to: "/dashboard" });
      return;
    }
    setLoading(plan.key);
    try {
      toast.loading("Redirecting to checkout…", { id: "checkout" });
      const result = await api.post("/api/billing", { planType: plan.key });
      // server returns sessionUrl; also handle url as fallback
      const url = result.data?.sessionUrl || result.data?.url;
      if (url) {
        window.location.assign(url);
      } else {
        toast.dismiss("checkout");
        toast.error("Could not start checkout. Please try again.");
      }
    } catch {
      toast.dismiss("checkout");
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="relative flex-1">
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs uppercase tracking-widest text-[color:var(--accent)] font-semibold">
              Pricing
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
              Simple, transparent{" "}
              <span className="text-gradient">pricing.</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Buy credits once. Build anytime. No subscriptions.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 text-left">
            {PLANS.map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-8 rounded-2xl border bg-card relative flex flex-col ${
                  p.featured
                    ? "shadow-elegant ring-1 ring-[color:var(--accent)]"
                    : "shadow-soft"
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-brand text-white shadow-glow whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {p.name}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">
                      {p.price}
                    </span>
                    {p.priceNum > 0 && (
                      <span className="text-muted-foreground text-sm">
                        /one-time
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>

                  <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-muted/50 w-fit">
                    <Coins size={14} className="text-amber-400" />
                    <span className="text-sm font-semibold">
                      {p.credits} Credits
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleUpgrade(p)}
                  fullWidth
                  variant={p.featured ? "contained" : "outlined"}
                  disabled={loading !== null}
                  sx={
                    p.featured
                      ? {
                          mt: 3,
                          background:
                            "linear-gradient(135deg,#6366f1,#a855f7)",
                          height: 44,
                          borderRadius: "10px",
                          fontWeight: 600,
                        }
                      : { mt: 3, height: 44, borderRadius: "10px", fontWeight: 600 }
                  }
                  startIcon={
                    loading === p.key ? null : p.priceNum > 0 ? (
                      <Zap size={15} />
                    ) : null
                  }
                >
                  {loading === p.key ? "Redirecting…" : p.button}
                </Button>

                <ul className="mt-7 space-y-3 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 items-start">
                      <Check
                        size={15}
                        className="text-[color:var(--accent)] mt-0.5 shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            Payments are processed securely via Stripe. Credits never expire.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
