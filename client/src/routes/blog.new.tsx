import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button, Chip, IconButton, InputBase, TextField } from "@mui/material";
import { ArrowLeft, Image as ImageIcon, Eye, Save, Send, X, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/new")({
  head: () => ({
    meta: [
      { title: "New post — GenWeb.ai" },
      { name: "description", content: "Write and publish a new blog post in the GenWeb.ai editor." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BlogEditor,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function BlogEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [cover, setCover] = useState("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=70");
  const [body, setBody] = useState("# Write something amazing\n\nStart typing your post in **Markdown**. Add images, lists, and code blocks — GenWeb takes care of the rest.\n\n## A section heading\n\n- A list item\n- Another item\n\n> A pull quote that sets the tone.\n");
  const [tags, setTags] = useState<string[]>(["AI", "Design"]);
  const [tagInput, setTagInput] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("saved");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (title && !slug) setSlug(slugify(title)); }, [title, slug]);

  // Auto-save indicator
  useEffect(() => {
    setSaving("saving");
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setSaving("saved"), 800);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [title, body, cover, tags, seoTitle, seoDesc, slug]);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]); setTagInput("");
  };

  const publish = () => {
    if (!title || !body) { toast.error("Title and content are required"); return; }
    toast.success("Post published 🚀");
    setTimeout(() => navigate({ to: "/blog" }), 600);
  };

  const html = useMemo(() => renderMarkdown(body), [body]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="border-b sticky top-16 z-30 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft size={14} /> Blog
            </Link>
            <span className="text-xs text-muted-foreground">/</span>
            <Chip size="small" label="Draft" sx={{ height: 22, fontSize: 11 }} />
            <span className="text-xs text-muted-foreground">
              {saving === "saving" ? "Saving…" : "Saved"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="small" variant="text" startIcon={<Eye size={14} />} onClick={() => setPreview((p) => !p)}>
              {preview ? "Edit" : "Preview"}
            </Button>
            <Button size="small" variant="outlined" startIcon={<Save size={14} />} onClick={() => { setSaving("saved"); toast.success("Draft saved"); }}>
              Save draft
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Send size={14} />}
              onClick={publish}
              sx={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)" }}
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 py-10 grid lg:grid-cols-[1fr_320px] gap-10">
        {/* Editor / Preview */}
        <div>
          {/* Cover */}
          <div className="relative rounded-2xl overflow-hidden border group">
            <img src={cover} alt="cover" className="w-full h-56 object-cover" />
            <button
              onClick={() => {
                const v = window.prompt("Cover image URL", cover);
                if (v) setCover(v);
              }}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-xs hover:bg-black/80"
            >
              <ImageIcon size={12} /> Change cover
            </button>
          </div>

          {/* Title */}
          {!preview ? (
            <>
              <InputBase
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled post"
                sx={{ mt: 4, fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", width: "100%" }}
                multiline
              />
              <InputBase
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="post-slug"
                sx={{ mt: 1, fontSize: 13, color: "var(--muted-foreground)", width: "100%" }}
                startAdornment={<span className="text-xs text-muted-foreground mr-1">/blog/</span>}
              />
              <div className="mt-6 rounded-2xl border bg-card">
                <div className="flex items-center justify-between border-b px-4 py-2">
                  <div className="text-xs text-muted-foreground">Markdown supported</div>
                  <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                    <Sparkles size={11} /> AI assist coming soon
                  </div>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Tell your story…"
                  className="w-full min-h-[480px] p-5 bg-transparent outline-none resize-y font-mono text-[14px] leading-relaxed"
                />
              </div>
            </>
          ) : (
            <article className="mt-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">{title || "Untitled post"}</h1>
              <div className="mt-3 text-sm text-muted-foreground">Preview · {Math.max(1, Math.round(body.split(/\s+/).length / 220))} min read</div>
              <div className="prose-blog mt-6" dangerouslySetInnerHTML={{ __html: html }} />
            </article>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card title="Tags">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted">
                  {t}
                  <IconButton size="small" sx={{ p: 0, ml: 0.5 }} onClick={() => setTags(tags.filter((x) => x !== t))}>
                    <X size={11} />
                  </IconButton>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <InputBase
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag"
                sx={{ fontSize: 13, flex: 1, border: "1px solid", borderColor: "divider", borderRadius: 1, px: 1, py: 0.5 }}
              />
              <Button size="small" onClick={addTag}>Add</Button>
            </div>
          </Card>

          <Card title="SEO">
            <TextField
              fullWidth size="small" label="SEO title" value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              helperText={`${seoTitle.length}/60`}
            />
            <TextField
              fullWidth size="small" label="Meta description" value={seoDesc} multiline minRows={3}
              onChange={(e) => setSeoDesc(e.target.value)} sx={{ mt: 2 }}
              helperText={`${seoDesc.length}/160`}
            />
          </Card>

          <Card title="Tips">
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>Use # for h1, ## for h2, ### for h3.</li>
              <li>Wrap quotes with &gt; at the start of a line.</li>
              <li>Use - for bullet lists.</li>
              <li>Add images with ![alt](url).</li>
            </ul>
          </Card>
        </aside>
      </div>

      <Footer />

      <style>{`
        .prose-blog h1{font-size:2.25rem;font-weight:800;letter-spacing:-0.02em;margin-top:2rem}
        .prose-blog h2{font-size:1.6rem;font-weight:700;letter-spacing:-0.02em;margin-top:2rem}
        .prose-blog h3{font-size:1.2rem;font-weight:600;margin-top:1.5rem}
        .prose-blog p{margin-top:1rem;line-height:1.75;color:color-mix(in oklab,var(--foreground) 85%,transparent)}
        .prose-blog blockquote{border-left:4px solid var(--accent);padding-left:1rem;margin-top:1.25rem;font-style:italic}
        .prose-blog ul{list-style:disc;padding-left:1.25rem;margin-top:1rem}
        .prose-blog img{border-radius:1rem;margin-top:1.25rem;max-width:100%}
        .prose-blog code{background:var(--muted);padding:0.1rem 0.35rem;border-radius:0.3rem;font-size:0.9em}
      `}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

// Minimal markdown → HTML renderer (safe-ish; this is a mock editor)
function renderMarkdown(src: string) {
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
  const lines = src.split("\n");
  let out = ""; let inList = false;
  for (const raw of lines) {
    const line = raw;
    if (/^### /.test(line)) { if (inList) { out += "</ul>"; inList = false; } out += `<h3>${esc(line.slice(4))}</h3>`; continue; }
    if (/^## /.test(line))  { if (inList) { out += "</ul>"; inList = false; } out += `<h2>${esc(line.slice(3))}</h2>`; continue; }
    if (/^# /.test(line))   { if (inList) { out += "</ul>"; inList = false; } out += `<h1>${esc(line.slice(2))}</h1>`; continue; }
    if (/^> /.test(line))   { if (inList) { out += "</ul>"; inList = false; } out += `<blockquote>${esc(line.slice(2))}</blockquote>`; continue; }
    const img = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (img) { if (inList) { out += "</ul>"; inList = false; } out += `<img alt="${esc(img[1])}" src="${esc(img[2])}" />`; continue; }
    if (/^- /.test(line))   { if (!inList) { out += "<ul>"; inList = true; } out += `<li>${inline(esc(line.slice(2)))}</li>`; continue; }
    if (inList) { out += "</ul>"; inList = false; }
    if (line.trim() === "") continue;
    out += `<p>${inline(esc(line))}</p>`;
  }
  if (inList) out += "</ul>";
  return out;
}
function inline(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
