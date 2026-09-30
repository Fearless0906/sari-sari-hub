import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/stock", label: "Stock" },
  { to: "/suppliers", label: "Suppliers" },
] as const;

export function AppHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 sm:px-8">
      <Link to="/" className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent font-display text-lg font-bold text-ink">
          S
        </div>
        <div>
          <p className="font-display text-lg font-bold leading-none tracking-tight">
            SariSari<span className="text-brand">Stock</span>
          </p>
          <p className="text-[11px] tracking-wide text-muted-foreground">
            Inventory for the corner store
          </p>
        </div>
      </Link>

      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            activeProps={{ className: "text-foreground font-medium" }}
            className="transition-colors hover:text-foreground"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="grid size-10 place-items-center rounded-full border border-border bg-secondary font-display text-sm font-semibold">
        MR
      </div>
    </header>
  );
}
