import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useProjects } from "@/lib/projects-store";
import { Button, IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import { Logo } from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Monitor, Tablet, Smartphone, Code2, Eye, MessageSquare, Send, RotateCcw,
  Play, Download, Share2, MoreHorizontal, ChevronLeft, Sparkles, Terminal, X,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme-store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/editor/$id")({
  head: ({ params }) => ({ meta: [{ title: `Editor — Lumen` }, { name: "description", content: "Lumen editor workspace." }] }),
  loader: ({ params }) => {
    return { id: params.id };
  },
  component: EditorPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <Link to="/dashboard" className="text-sm text-[color:var(--accent)] mt-3 inline-block">← Back to dashboard</Link>
      </div>
    </div>
  ),
});

type Device = "desktop" | "tablet" | "mobile";
type Msg = { role: "user" | "ai"; text: string };

function EditorPage() {
  const { id } = Route.useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ["website", id],
    queryFn: async () => {
      const res = await api.get(`/api/website/get-by-id/${id}`);
      return res.data;
    }
  });

  const fileNames = ["index.html"];
  const [active, setActive] = useState(fileNames[0]);
  const [files, setFiles] = useState<Record<string, string>>({ "index.html": "" });
  const [device, setDevice] = useState<Device>("desktop");
  const [showCode, setShowCode] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const [logs, setLogs] = useState<{ kind: "log" | "error"; text: string; t: number }[]>([
    { kind: "log", t: Date.now(), text: `Preview started` },
  ]);
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (project) {
      setFiles({ "index.html": project.latestCode || "" });
      setMessages(project.conversation?.map((c: any) => ({ role: c.role, text: c.content })) || []);
    }
  }, [project]);

  // removed autosave since backend saves it during update

  // listen to iframe logs
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.__lumen) {
        setLogs((l) => [...l, { kind: e.data.kind, text: e.data.text, t: Date.now() }].slice(-200));
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const srcDoc = useMemo(() => buildPreview(files), [files, previewKey]);

  const { mutate: updateWebsite, isPending: thinking } = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post(`/api/website/update/${id}`, { prompt: text });
      return res.data;
    },
    onSuccess: (data) => {
      setFiles({ "index.html": data.code || "" });
      setMessages((m) => [...m, { role: "ai", text: data.message || "Updated successfully." }]);
    },
    onError: () => toast.error("Update failed")
  });

  const send = () => {
    const text = input.trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    updateWebsite(text);
  };

  const width = device === "desktop" ? "100%" : device === "tablet" ? 768 : 390;
  const lang = active.endsWith(".html") ? "html" : active.endsWith(".css") ? "css" : "javascript";

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* TOP BAR */}
      <header className="h-12 border-b glass flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Tooltip title="Back"><IconButton size="small" onClick={() => navigate({ to: "/dashboard" })}><ChevronLeft size={16} /></IconButton></Tooltip>
          <Link to="/" className="hidden sm:block"><Logo size={18} /></Link>
          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />
          <div className="text-sm font-medium truncate max-w-[180px]">{project?.title || project?.name || "Loading..."}</div>
          <span className="text-xs text-muted-foreground hidden md:inline"></span>
        </div>
        <div className="flex items-center gap-1">
          <Toggle on={showChat} onClick={() => setShowChat(!showChat)} icon={MessageSquare} label="Chat" />
          <Toggle on={!showCode} onClick={() => setShowCode(false)} icon={Eye} label="Preview" />
          <Toggle on={showCode} onClick={() => setShowCode(true)} icon={Code2} label="Code" />
          <div className="h-5 w-px bg-border mx-1" />
          {[{ k: "desktop", I: Monitor }, { k: "tablet", I: Tablet }, { k: "mobile", I: Smartphone }].map(({ k, I }) => (
            <Tooltip key={k} title={k}>
              <IconButton size="small" onClick={() => setDevice(k as Device)} sx={{ color: device === k ? "primary.main" : "text.secondary" }}>
                <I size={16} />
              </IconButton>
            </Tooltip>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle size="small" />
          <Tooltip title="Reload preview"><IconButton size="small" onClick={() => setPreviewKey((k) => k + 1)}><RotateCcw size={15} /></IconButton></Tooltip>
          <Button size="small" variant="outlined" startIcon={<Share2 size={14} />} sx={{ ml: 0.5 }} onClick={() => { navigator.clipboard?.writeText(location.href); toast.success("Link copied"); }}>Share</Button>
          <Button size="small" variant="contained" startIcon={<Play size={14} />} sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }} onClick={() => toast.success("Deploy started")}>Deploy</Button>
          <IconButton size="small" onClick={(e) => setMenu(e.currentTarget)}><MoreHorizontal size={16} /></IconButton>
          <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)}>
            <MenuItem onClick={() => { downloadZip(project?.title || "project", files); setMenu(null); }}><Download size={14} style={{ marginRight: 8 }} /> Download ZIP</MenuItem>
            <MenuItem onClick={() => { navigator.clipboard?.writeText(files[active] ?? ""); toast.success("File copied"); setMenu(null); }}>Copy file</MenuItem>
          </Menu>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex-1 flex min-h-0">
        {/* CHAT */}
        <AnimatePresence initial={false}>
          {showChat && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-r bg-sidebar flex flex-col shrink-0 overflow-hidden"
            >
              <div className="h-10 px-4 flex items-center justify-between border-b text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Sparkles size={13} className="text-[color:var(--accent)]" /> AI Assistant</div>
                <IconButton size="small" onClick={() => setShowChat(false)}><X size={13} /></IconButton>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[88%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-brand text-white" : "bg-muted"}`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-3.5 py-2 rounded-2xl flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-foreground/60" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {["Add pricing", "Modern look", "Change navbar color"].map((s) => (
                    <button key={s} onClick={() => setInput(s)} className="text-[11px] px-2 py-1 rounded-full border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition">{s}</button>
                  ))}
                </div>
                <div className="flex items-end gap-2 rounded-xl border bg-card p-2 focus-within:ring-2 ring-[color:var(--accent)]/40">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    rows={2}
                    placeholder="Ask for a change…"
                    className="flex-1 bg-transparent outline-none text-sm resize-none placeholder:text-muted-foreground"
                  />
                  <IconButton size="small" onClick={send} sx={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", "&:hover": { opacity: 0.9, background: "linear-gradient(135deg,#6366f1,#a855f7)" } }}>
                    <Send size={14} />
                  </IconButton>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* PREVIEW + CODE */}
        <div className="flex-1 flex min-w-0">
          {/* PREVIEW */}
          <div className={`${showCode ? "hidden lg:flex lg:flex-1" : "flex-1"} flex-col min-w-0 border-r`}>
            <div className="flex-1 bg-surface p-4 overflow-auto grid place-items-start justify-center">
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                style={{ width, maxWidth: "100%" }}
                className="rounded-xl overflow-hidden border bg-background shadow-elegant"
              >
                <iframe
                  key={previewKey}
                  title="preview"
                  srcDoc={srcDoc}
                  sandbox="allow-scripts allow-same-origin"
                  className="w-full bg-white"
                  style={{ height: "calc(100vh - 8rem)", border: 0 }}
                />
              </motion.div>
            </div>
            {/* CONSOLE */}
            <div className="border-t bg-card shrink-0">
              <button onClick={() => setShowConsole(!showConsole)} className="w-full h-9 px-4 flex items-center justify-between text-xs text-muted-foreground hover:bg-muted/50 transition">
                <span className="flex items-center gap-2"><Terminal size={13} /> Console ({logs.length})</span>
                <span>{showConsole ? "Hide" : "Show"}</span>
              </button>
              {showConsole && (
                <div className="h-40 overflow-y-auto px-4 py-2 font-mono text-xs space-y-1 scrollbar-thin border-t">
                  {logs.map((l, i) => (
                    <div key={i} className={l.kind === "error" ? "text-destructive" : "text-muted-foreground"}>
                      <span className="text-[10px] opacity-60 mr-2">{new Date(l.t).toLocaleTimeString()}</span>{l.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CODE */}
          {showCode && (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="h-10 border-b flex items-center gap-1 px-2 bg-card shrink-0 overflow-x-auto scrollbar-thin">
                {fileNames.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActive(f)}
                    className={`px-3 h-8 rounded-md text-xs font-medium whitespace-nowrap transition ${active === f ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  height="100%"
                  language={lang}
                  value={files[active]}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  onChange={(v) => setFiles((f) => ({ ...f, [active]: v ?? "" }))}
                  options={{
                    fontSize: 13,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    minimap: { enabled: false },
                    smoothScrolling: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 14 },
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, icon: Icon, label }: { on: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <Tooltip title={label}>
      <IconButton size="small" onClick={onClick} sx={{ color: on ? "primary.main" : "text.secondary", bgcolor: on ? "action.hover" : "transparent" }}>
        <Icon size={15} />
      </IconButton>
    </Tooltip>
  );
}

function buildPreview(files: Record<string, string>) {
  const html = files["index.html"] || "<!doctype html><body></body>";
  const css = files["styles.css"] || "";
  const js = files["app.js"] || "";
  const injected = `
    <style>${css}</style>
    <script>
      (function(){
        const post=(kind,args)=>{try{parent.postMessage({__lumen:1,kind,text:Array.from(args).map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ')},'*')}catch(e){}};
        const ol=console.log, oe=console.error;
        console.log=function(){post('log',arguments); ol.apply(console,arguments)};
        console.error=function(){post('error',arguments); oe.apply(console,arguments)};
        window.addEventListener('error',e=>post('error',[e.message]));
      })();
    </script>
    <script>${js}</script>
  `;
  if (html.includes("</body>")) return html.replace("</body>", injected + "</body>");
  return html + injected;
}

function mockReply(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("color") || p.includes("navbar")) return "Updated the navbar with a softer violet accent and a subtle bottom border. Want a sticky variant?";
  if (p.includes("pricing")) return "Added a 3-tier pricing section with a featured 'Pro' card and gradient CTA. Shall I add a FAQ below?";
  if (p.includes("modern") || p.includes("premium")) return "Bumped the type scale, refined spacing, and tightened the hero. Feels more premium now.";
  if (p.includes("hero")) return "Reworked the hero: larger display, gradient text on the keyword, and a glass CTA bar.";
  return "Done. I tweaked a few details — refresh the preview to see the change. What's next?";
}

function downloadZip(name: string, files: Record<string, string>) {
  // Lightweight: concat files into a single .txt as ZIP isn't bundled here
  const blob = new Blob(
    [Object.entries(files).map(([n, c]) => `/* ===== ${n} ===== */\n${c}`).join("\n\n")],
    { type: "text/plain" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${name}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Project downloaded");
}
