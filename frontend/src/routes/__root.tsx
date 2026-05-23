import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/lib/user-store";
import { useTheme } from "@/lib/theme-store";

import appCss from "../styles.css?url";
import { MuiProviders } from "@/components/mui-providers";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GenWeb.ai" },
      { name: "description", content: "Build modern websites instantly using AI prompts. Generate responsive, production-ready websites with live preview and editable code." },
      { name: "author", content: "GenWeb.ai" },
      { property: "og:title", content: "GenWeb.ai — AI Website Builder" },
      { property: "og:description", content: "Turn ideas into beautiful, production-ready websites in seconds — using natural language." },
      { property: "og:site_name", content: "GenWeb.ai" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GenWeb.ai — AI Website Builder" },
      { name: "twitter:description", content: "From prompt to production-ready website." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
      { rel: "apple-touch-icon", href: "/logo.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <style>{bootLoaderCss}</style>
      </head>
      <body>
        <div id="genweb-boot-loader" aria-label="Loading GenWeb.ai">
          <div className="genweb-boot-grid" />
          <div className="genweb-boot-panel">
            <div className="genweb-boot-logo">
              <svg width="34" height="34" viewBox="0 0 96 96" fill="none" aria-hidden="true">
                <path d="M48 18L54.6 40.4L77 47L54.6 53.6L48 76L41.4 53.6L19 47L41.4 40.4L48 18Z" fill="white" />
                <path d="M69 15L71.8 24.2L81 27L71.8 29.8L69 39L66.2 29.8L57 27L66.2 24.2L69 15Z" fill="white" fillOpacity="0.86" />
              </svg>
            </div>
            <div className="genweb-boot-copy">
              <div className="genweb-boot-title">GenWeb.ai</div>
              <div className="genweb-boot-subtitle">Preparing your AI website builder</div>
            </div>
            <div className="genweb-boot-bar">
              <div />
            </div>
          </div>
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const themeInitScript = `
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      var theme = saved === "light" || saved === "dark"
        ? saved
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
    } catch (e) {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    }
  })();
`;

const bootLoaderCss = `
  #genweb-boot-loader {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: grid;
    place-items: center;
    overflow: hidden;
    color: #111827;
    background:
      radial-gradient(780px 420px at 50% -10%, rgba(99, 102, 241, 0.16), transparent 62%),
      radial-gradient(560px 360px at 88% 18%, rgba(6, 182, 212, 0.12), transparent 64%),
      #ffffff;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition: opacity 320ms ease, visibility 320ms ease;
  }

  .dark #genweb-boot-loader,
  html[data-theme="dark"] #genweb-boot-loader {
    color: #fafafa;
    background:
      radial-gradient(780px 420px at 50% -10%, rgba(139, 92, 246, 0.28), transparent 62%),
      radial-gradient(560px 360px at 88% 18%, rgba(6, 182, 212, 0.18), transparent 64%),
      #09090b;
  }

  body.genweb-ready #genweb-boot-loader {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .genweb-boot-grid {
    position: absolute;
    inset: -1px;
    background-image:
      linear-gradient(to right, rgba(17,24,39,0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(17,24,39,0.08) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: radial-gradient(ellipse at center, black 18%, transparent 72%);
    opacity: 0.62;
  }

  .dark .genweb-boot-grid,
  html[data-theme="dark"] .genweb-boot-grid {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px);
    opacity: 0.52;
  }

  .genweb-boot-panel {
    position: relative;
    display: grid;
    justify-items: center;
    width: min(320px, calc(100vw - 48px));
    padding: 28px 24px 24px;
    text-align: center;
  }

  .genweb-boot-logo {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg, #8b5cf6, #06b6d4);
    box-shadow: 0 22px 70px -18px rgba(99, 102, 241, 0.7);
    animation: genweb-boot-float 2.4s ease-in-out infinite;
  }

  .dark .genweb-boot-logo,
  html[data-theme="dark"] .genweb-boot-logo {
    box-shadow: 0 22px 70px -18px rgba(139, 92, 246, 0.85);
  }

  .genweb-boot-title {
    margin-top: 18px;
    font-size: 26px;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0;
  }

  .genweb-boot-subtitle {
    margin-top: 8px;
    font-size: 13px;
    color: rgba(17, 24, 39, 0.62);
  }

  .dark .genweb-boot-subtitle,
  html[data-theme="dark"] .genweb-boot-subtitle {
    color: rgba(250, 250, 250, 0.68);
  }

  .genweb-boot-bar {
    width: 176px;
    height: 4px;
    margin-top: 22px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(17, 24, 39, 0.12);
  }

  .dark .genweb-boot-bar,
  html[data-theme="dark"] .genweb-boot-bar {
    background: rgba(255, 255, 255, 0.1);
  }

  .genweb-boot-bar > div {
    width: 42%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #8b5cf6, #06b6d4);
    animation: genweb-boot-load 1.15s ease-in-out infinite;
  }

  @keyframes genweb-boot-load {
    0% { transform: translateX(-115%); }
    100% { transform: translateX(250%); }
  }

  @keyframes genweb-boot-float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-6px) scale(1.03); }
  }
`;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const setUser = useUser((state) => state.setUser);
  const initTheme = useTheme((state) => state.init);

  useEffect(() => {
    document.body.classList.add("genweb-ready");
    initTheme();

    const fetchUser = async () => {
      try {
        const response = await api.get('/api/user/me');
        if (response.data && response.data._id) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, [initTheme, setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <MuiProviders>
        <Outlet />
        <Toaster richColors position="bottom-right" />
      </MuiProviders>
    </QueryClientProvider>
  );
}
