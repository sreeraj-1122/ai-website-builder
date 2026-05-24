import { Link } from "@tanstack/react-router";
import { Logo } from "./navbar";
import { Github, Globe, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-surface mt-24">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            The fastest way to create websites with AI. From prompt to production-ready in seconds.
          </p>
          <div className="flex gap-2 pt-2 text-muted-foreground">
            <a href="https://github.com/sreeraj-1122" className="hover:text-foreground"><Github size={18} /></a>
            <a href="https://sreeraj.vercel.app/" className="hover:text-foreground"><Globe size={18} /></a>
            <a href="https://www.linkedin.com/in/sreeraj-k1/" className="hover:text-foreground"><Linkedin size={18} /></a>
          </div>
        </div>
        {[
          { title: "Product", links: [["Features","/"],["Templates","/templates"],["Pricing","/pricing"],["Dashboard","/dashboard"]] },
          { title: "Resources", links: [["Blog","/blog"],["Docs","/"],["Changelog","/"],["Contact","/"]] },
          { title: "Legal", links: [["Privacy","/"],["Terms","/"],["Security","/"],["Status","/"]] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold mb-3 text-sm">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map(([l, href]) => (
                <li key={l}><Link to={href as string} className="hover:text-foreground">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs text-muted-foreground flex justify-between">
          <span>© {new Date().getFullYear()} GenWeb.ai</span>
          <span>Generated using GenWeb.ai</span>
        </div>
      </div>
    </footer>
  );
}
