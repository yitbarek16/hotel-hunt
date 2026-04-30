import { BidStatus } from "@hotel-hunt/database";
import { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-stone-600">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ status }: { status: BidStatus }) {
  const styles: Record<BidStatus, string> = {
    PENDING: "bg-amber-50 text-amber-800 ring-amber-200",
    ACCEPTED: "bg-teal-50 text-teal-800 ring-teal-200",
    REJECTED: "bg-rose-50 text-rose-800 ring-rose-200",
    BOOKED: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants = {
    primary:
      "bg-teal-700 text-white hover:bg-teal-800 disabled:bg-stone-300",
    secondary:
      "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
    danger: "bg-rose-700 text-white hover:bg-rose-800",
    ghost: "text-stone-700 hover:bg-stone-100",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none ring-teal-600 focus:ring-2"
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 outline-none ring-teal-600 focus:ring-2"
      {...props}
    />
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl bg-stone-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );
}
