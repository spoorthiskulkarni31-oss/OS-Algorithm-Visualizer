import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "outline" | "danger" | "ghost";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_0_22px_-6px_var(--neon-cyan)] hover:shadow-[0_0_30px_-2px_var(--neon-cyan)] hover:brightness-110",
  outline:
    "border border-primary/45 bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-[0_0_20px_-6px_var(--neon-cyan)]",
  danger:
    "bg-destructive text-destructive-foreground hover:brightness-110 hover:shadow-[0_0_24px_-6px_var(--destructive)]",
  ghost: "border border-border bg-secondary text-secondary-foreground hover:bg-muted",
};

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
}

export function NeonButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: NeonButtonProps) {
  return (
    <button
      className={cn(
        "font-display inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm",
        BUTTON_VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Panels & headers                                                    */
/* ------------------------------------------------------------------ */

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("glow-panel rounded-2xl p-5 sm:p-6", className)}>{children}</section>
  );
}

export function PanelTitle({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-bold tracking-[0.12em] text-foreground uppercase">
      {icon}
      {children}
    </h2>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="font-display text-xs font-semibold tracking-[0.3em] text-primary/80 uppercase">
        {kicker}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
        <span className="neon-text">{title}</span>
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                          */
/* ------------------------------------------------------------------ */

type StatTone = "cyan" | "purple" | "blue" | "green" | "red";

const STAT_TONES: Record<StatTone, string> = {
  cyan: "text-primary border-primary/30",
  purple: "text-accent border-accent/40",
  blue: "text-neon-blue border-neon-blue/40",
  green: "text-success border-success/40",
  red: "text-destructive border-destructive/40",
};

export function StatCard({
  label,
  value,
  sub,
  tone = "cyan",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: StatTone;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card/70 px-4 py-3 shadow-[0_0_20px_-10px_currentColor]",
        STAT_TONES[tone],
      )}
    >
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      <p className="num mt-1 text-2xl font-bold">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

type BadgeTone = "success" | "error" | "purple" | "muted";

const BADGE_TONES: Record<BadgeTone, string> = {
  success: "border-success/50 bg-success/10 text-success",
  error: "border-destructive/50 bg-destructive/10 text-destructive",
  purple: "border-accent/50 bg-accent/10 text-accent",
  muted: "border-border bg-secondary text-muted-foreground",
};

export function StatusBadge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase",
        BADGE_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Error alert                                                         */
/* ------------------------------------------------------------------ */

export function ErrorAlert({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      <svg
        className="mt-0.5 size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4m0 4h.01" />
      </svg>
      <div>
        <p className="font-semibold">Fix the following to continue:</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-card/40 px-6 py-10 text-center">
      <p className="font-display text-sm font-bold tracking-[0.2em] text-primary/80 uppercase">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
