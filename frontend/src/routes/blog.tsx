import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Avatar, Button, Chip, InputBase } from "@mui/material";
import { Sparkles, ArrowRight, Search, PenLine } from "lucide-react";
import { useMemo, useState } from "react";
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogPost } from "@/data/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — GenWeb.ai" },
      { name: "description", content: "Insights on AI website builders, design trends, frontend engineering, and how to ship beautiful sites faster with GenWeb.ai." },
      { property: "og:title", content: "Blog — GenWeb.ai" },
      { property: "og:description", content: "Guides, tutorials, and comparisons from the frontier of AI-generated web design." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];

  const list = useMemo(() => {
    return BLOG_POSTS.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [cat, q]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Chip icon={<Sparkles size={14} />} label="GenWeb Journal" size="small" sx={{ background: "color-mix(in oklab, var(--accent) 12%, transparent)", border: "1px solid", borderColor: "divider" }} />
              <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">Ideas on shipping with <span className="text-gradient">AI.</span></h1>
              <p className="mt-4 text-muted-foreground max-w-xl">Guides, tutorials, and field notes from the frontier of AI-generated web design.</p>
            </div>
            <Link to="/blog/new">
              <Button variant="outlined" startIcon={<PenLine size={16} />}>New post</Button>
            </Link>
          </div>

          <div className="mt-8 max-w-xl flex items-center gap-2 rounded-2xl border bg-card/80 backdrop-blur shadow-soft px-4 py-3">
            <Search size={18} className="text-muted-foreground" />
            <InputBase
              fullWidth
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              sx={{ fontSize: 14 }}
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 pt-12 w-full">
        <FeaturedCard post={featured} />
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 pt-12 w-full">
        <div className="flex flex-wrap gap-2 mb-8">
          {BLOG_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${cat === c ? "bg-foreground text-background border-foreground" : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
          {list.map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -3 }}
        className="group rounded-3xl border bg-card overflow-hidden grid md:grid-cols-2 shadow-soft hover:shadow-elegant transition-all"
      >
        <div className="relative h-64 md:h-full overflow-hidden">
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute top-4 left-4">
            <Chip size="small" label="Featured" sx={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "white", fontWeight: 600 }} />
          </div>
        </div>
        <div className="p-7 md:p-10 flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--accent)] font-semibold">{post.category}</div>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight leading-tight">{post.title}</h2>
          <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar src={post.author.avatar} sx={{ width: 36, height: 36 }} />
            <div className="text-sm">
              <div className="font-medium">{post.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {post.readingMinutes} min read
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function PostCard({ post, i }: { post: BlogPost; i: number }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}>
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }}
        whileHover={{ y: -3 }}
        className="group rounded-2xl border bg-card shadow-soft hover:shadow-elegant transition-all overflow-hidden flex flex-col h-full"
      >
        <div className="relative h-44 overflow-hidden">
          <img src={post.cover} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="text-[11px] uppercase tracking-widest text-[color:var(--accent)] font-semibold">{post.category}</div>
          <h3 className="mt-2 font-semibold text-lg tracking-tight leading-snug">{post.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground flex-1 line-clamp-2">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar src={post.author.avatar} sx={{ width: 22, height: 22 }} />
              <span>{post.author.name}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-foreground font-medium group-hover:text-[color:var(--accent)] transition-colors">
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
