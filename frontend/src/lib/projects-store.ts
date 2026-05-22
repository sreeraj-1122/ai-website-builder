import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  prompt: string;
  updatedAt: number;
  thumbColor: string;
  files: Record<string, string>;
}

const seed = (): Project[] => [
  {
    id: "p1",
    name: "Nimbus SaaS",
    prompt: "Create a SaaS landing page for a productivity tool",
    updatedAt: Date.now() - 1000 * 60 * 30,
    thumbColor: "from-indigo-500 to-fuchsia-500",
    files: defaultFiles("Nimbus", "Productivity, reimagined."),
  },
  {
    id: "p2",
    name: "Lens Portfolio",
    prompt: "Portfolio website for a photographer",
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
    thumbColor: "from-amber-400 to-rose-500",
    files: defaultFiles("Lens", "Photography that lingers."),
  },
  {
    id: "p3",
    name: "Forge Commerce",
    prompt: "Modern ecommerce homepage",
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    thumbColor: "from-emerald-400 to-cyan-500",
    files: defaultFiles("Forge", "Tools built for makers."),
  },
  {
    id: "p4",
    name: "Pulse Dashboard",
    prompt: "Build a modern dashboard UI",
    updatedAt: Date.now() - 1000 * 60 * 60 * 72,
    thumbColor: "from-violet-500 to-blue-500",
    files: defaultFiles("Pulse", "Your metrics, alive."),
  },
];

export function defaultFiles(brand: string, tagline: string): Record<string, string> {
  return {
    "index.html": `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${brand}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <div class="brand">${brand}</div>
    <nav><a href="#">Features</a><a href="#">Pricing</a><a href="#">Docs</a></nav>
    <button class="cta">Get started</button>
  </header>
  <main>
    <section class="hero">
      <span class="badge">New · v2.0</span>
      <h1>${tagline}</h1>
      <p>Ship beautiful interfaces in minutes with AI that understands taste.</p>
      <div class="row">
        <button class="cta">Start free</button>
        <button class="ghost">Watch demo</button>
      </div>
    </section>
    <section class="grid">
      <div class="card"><h3>Fast</h3><p>Render in milliseconds.</p></div>
      <div class="card"><h3>Beautiful</h3><p>Awwwards-grade by default.</p></div>
      <div class="card"><h3>Yours</h3><p>Own the code, forever.</p></div>
    </section>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
    "styles.css": `:root{--bg:#0b0b10;--fg:#fafafa;--mut:#9ca3af;--acc:#8b5cf6;--card:#14141b;--bd:#27272a}
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--fg)}
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid var(--bd)}
.brand{font-weight:700;letter-spacing:-.02em}
.nav nav a{color:var(--mut);margin-right:18px;text-decoration:none}
.cta{background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;border:0;padding:10px 18px;border-radius:10px;font-weight:600;cursor:pointer}
.ghost{background:transparent;color:var(--fg);border:1px solid var(--bd);padding:10px 18px;border-radius:10px;cursor:pointer}
.hero{text-align:center;padding:120px 24px 80px;background:radial-gradient(800px 400px at 50% -10%,rgba(139,92,246,.25),transparent)}
.badge{display:inline-block;padding:6px 12px;border:1px solid var(--bd);border-radius:999px;color:var(--mut);font-size:13px;margin-bottom:18px}
h1{font-size:64px;line-height:1.05;margin:0 0 18px;letter-spacing:-.03em;background:linear-gradient(135deg,#fff,#a78bfa);-webkit-background-clip:text;color:transparent}
.hero p{color:var(--mut);max-width:560px;margin:0 auto 28px;font-size:18px}
.row{display:flex;gap:12px;justify-content:center}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:40px 32px 80px;max-width:1100px;margin:0 auto}
.card{background:var(--card);border:1px solid var(--bd);border-radius:16px;padding:24px}
.card h3{margin:0 0 6px}.card p{color:var(--mut);margin:0}`,
    "app.js": `// ${brand} interactions
document.querySelectorAll('.cta').forEach(b => b.addEventListener('click', () => {
  b.animate([{ transform: 'scale(1)' },{ transform: 'scale(.96)' },{ transform: 'scale(1)' }], { duration: 220 });
}));
console.log('${brand} loaded');`,
  };
}

interface State {
  projects: Project[];
  create: (prompt: string, name?: string) => Project;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  update: (id: string, files: Record<string, string>) => void;
  get: (id: string) => Project | undefined;
}

export const useProjects = create<State>((set, get) => ({
  projects: seed(),
  create: (prompt, name) => {
    const p: Project = {
      id: "p" + Math.random().toString(36).slice(2, 9),
      name: name || prompt.slice(0, 32) || "Untitled",
      prompt,
      updatedAt: Date.now(),
      thumbColor: ["from-indigo-500 to-fuchsia-500", "from-amber-400 to-rose-500", "from-emerald-400 to-cyan-500", "from-violet-500 to-blue-500"][Math.floor(Math.random() * 4)],
      files: defaultFiles(name || "Untitled", prompt),
    };
    set((s) => ({ projects: [p, ...s.projects] }));
    return p;
  },
  remove: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  rename: (id, name) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, name, updatedAt: Date.now() } : p)) })),
  update: (id, files) => set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, files, updatedAt: Date.now() } : p)) })),
  get: (id) => get().projects.find((p) => p.id === id),
}));
