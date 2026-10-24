import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Cpu, Home, Blocks, HardDrive, BrainCircuit } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glow-panel max-w-md rounded-2xl p-10 text-center">
        <h1 className="num text-7xl font-bold neon-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Sector not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold tracking-wide text-primary-foreground transition-shadow hover:shadow-[0_0_24px_-4px_var(--neon-cyan)]"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="glow-panel max-w-md rounded-2xl p-10 text-center">
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
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-shadow hover:shadow-[0_0_24px_-4px_var(--neon-cyan)]"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
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
      { title: "OS Algorithm Visualizer – First-Fit & C-LOOK" },
      {
        name: "description",
        content:
          "Interactive Operating Systems learning lab: visualize First-Fit memory allocation and C-LOOK disk scheduling, then test yourself with a quiz.",
      },
      { property: "og:title", content: "OS Algorithm Visualizer – First-Fit & C-LOOK" },
      {
        property: "og:description",
        content:
          "Interactive Operating Systems learning lab: visualize First-Fit memory allocation and C-LOOK disk scheduling, then test yourself with a quiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&family=Rajdhani:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/first-fit", label: "First-Fit", icon: Blocks, exact: false },
  { to: "/c-look", label: "C-LOOK", icon: HardDrive, exact: false },
  { to: "/quiz", label: "Quiz", icon: BrainCircuit, exact: false },
] as const;

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="OS Algo Lab home">
          <span className="grid size-9 place-items-center rounded-lg border border-primary/40 bg-primary/10 shadow-[0_0_18px_-4px_var(--neon-cyan)]">
            <Cpu className="size-5 text-primary" />
          </span>
          <span className="font-display text-base font-bold tracking-[0.18em] text-foreground sm:text-lg">
            OS <span className="neon-text">ALGO</span> LAB
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary/15 data-[status=active]:text-primary data-[status=active]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--neon-cyan)_40%,transparent)] sm:px-3.5"
            >
              <Icon className="size-4" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-primary/15 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-foreground">
          OS <span className="neon-text">ALGO</span> LAB
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          An interactive educational tool for visualizing Operating System memory allocation and
          disk scheduling algorithms — built for students, by simulation.
        </p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="cyber-grid flex min-h-screen flex-col bg-background">
        <Navbar />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
