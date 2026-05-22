import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Avatar, Button, Chip, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight, Twitter, Linkedin, Link as LinkIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { blogBySlug, relatedPosts, type BlogBlock } from "@/data/blog";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { BlogPost } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }): BlogPost => {
    const post = blogBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Article — GenWeb.ai" }] };
    return {
      meta: [
        { title: loaderData.seoTitle ?? `${loaderData.title} — GenWeb.ai` },
        { name: "description", content: loaderData.seoDescription ?? loaderData.excerpt },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:image", content: loaderData.cover },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.excerpt },
        { name: "twitter:image", content: loaderData.cover },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title,
            description: loaderData.excerpt,
            image: loaderData.cover,
            datePublished: loaderData.publishedAt,
            author: { "@type": "Person", name: loaderData.author.name },
            publisher: { "@type": "Organization", name: "GenWeb.ai" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 grid place-items-center p-10 text-center">
        <div>
          <h1 className="text-3xl font-bold">Post not found</h1>
          <p className="mt-2 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link to="/blog"><Button sx={{ mt: 3 }} variant="outlined" startIcon={<ArrowLeft size={16} />}>Back to blog</Button></Link>
        </div>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: () => null,
  component: BlogDetail,
});

function BlogDetail() {
  const post = Route.useLoaderData() as BlogPost;
  const related = useMemo(() => relatedPosts(post.slug), [post.slug]);
  const headings = useMemo(
    () => post.content.flatMap((b, i) => (b.type === "h2" ? [{ id: `h-${i}`, text: b.text }] : [])),
    [post],
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-hero pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 pt-10 md:pt-16">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back to blog
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Chip size="small" label={post.category} sx={{ background: "color-mix(in oklab, var(--accent) 14%, transparent)", color: "var(--accent)", fontWeight: 600 }} />
            {post.tags.map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-widest text-muted-foreground">#{t}</span>
            ))}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-tight"
          >{post.title}</motion.h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="mt-7 flex items-center justify-between gap-4 border-y py-4">
            <div className="flex items-center gap-3">
              <Avatar src={post.author.avatar} sx={{ width: 40, height: 40 }} />
              <div className="text-sm">
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {post.author.role} · {new Date(post.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {post.readingMinutes} min read
                </div>
              </div>
            </div>
            <ShareButtons title={post.title} />
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl px-6 mt-10">
          <div className="rounded-3xl overflow-hidden border shadow-elegant">
            <img src={post.cover} alt={post.title} className="w-full h-[260px] md:h-[420px] object-cover" />
          </div>
        </div>
      </section>

      {/* Body + TOC */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid lg:grid-cols-[1fr_240px] gap-12 w-full">
        <article className="max-w-3xl mx-auto lg:mx-0">
          {post.content.map((block, i) => <Block key={i} block={block} idx={i} />)}

          {/* Newsletter CTA */}
          <div className="mt-14 rounded-2xl border bg-gradient-to-br from-[color:var(--accent)]/10 to-transparent p-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)" }}>
                <Mail size={18} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold tracking-tight">Get GenWeb Journal</h3>
                <p className="text-sm text-muted-foreground mt-1">One thoughtful email a week about AI, design, and shipping faster.</p>
              </div>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed!"); }}
              className="mt-5 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
              />
              <Button type="submit" variant="contained" sx={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)" }}>Subscribe</Button>
            </form>
          </div>
        </article>

        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">On this page</div>
            <ul className="mt-4 space-y-2">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors block">{h.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 w-full">
          <h2 className="text-2xl font-bold tracking-tight">Keep reading</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link to="/blog/$slug" params={{ slug: r.slug }} key={r.slug} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-elegant transition-all">
                <div className="h-36 overflow-hidden">
                  <img src={r.cover} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-widest text-[color:var(--accent)] font-semibold">{r.category}</div>
                  <div className="mt-2 font-semibold tracking-tight leading-snug">{r.title}</div>
                  <div className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">Read <ArrowRight size={12} /></div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function Block({ block, idx }: { block: BlogBlock; idx: number }) {
  switch (block.type) {
    case "h2":
      return <h2 id={`h-${idx}`} className="mt-12 text-2xl md:text-3xl font-bold tracking-tight scroll-mt-24">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-8 text-xl font-semibold tracking-tight">{block.text}</h3>;
    case "p":
      return <p className="mt-5 text-[17px] leading-[1.75] text-foreground/85">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="mt-8 border-l-4 pl-5 italic text-lg text-foreground/90" style={{ borderColor: "var(--accent)" }}>
          "{block.text}"{block.author && <div className="mt-2 text-sm text-muted-foreground not-italic">— {block.author}</div>}
        </blockquote>
      );
    case "list":
      return (
        <ul className="mt-5 space-y-2 list-disc pl-6 text-[17px] text-foreground/85">
          {block.items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      );
    case "image":
      return (
        <figure className="mt-8">
          <div className="rounded-2xl overflow-hidden border">
            <img src={block.src} alt={block.caption ?? ""} className="w-full h-auto" />
          </div>
          {block.caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{block.caption}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <div className="mt-8 rounded-2xl border bg-muted/40 p-5">
          <div className="font-semibold tracking-tight">{block.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{block.text}</div>
        </div>
      );
    case "code":
      return (
        <pre className="mt-6 rounded-xl border bg-[#0b1020] text-zinc-100 text-[13px] p-5 overflow-x-auto font-mono leading-relaxed">
          <code>{block.code}</code>
        </pre>
      );
  }
}

function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  if (typeof window !== "undefined" && !url) setUrl(window.location.href);
  const enc = encodeURIComponent;
  return (
    <div className="flex items-center gap-1">
      <IconButton size="small" component="a" href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noreferrer"><Twitter size={16} /></IconButton>
      <IconButton size="small" component="a" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noreferrer"><Linkedin size={16} /></IconButton>
      <IconButton size="small" onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copied"); }}><LinkIcon size={16} /></IconButton>
    </div>
  );
}
