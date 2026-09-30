import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { peso, restock, statusOf, summary, useInventory } from "@/lib/inventory";

export const Route = createFileRoute("/stock")({
  head: () => ({
    meta: [
      { title: "Stock — SariSariStock" },
      {
        name: "description",
        content:
          "Low-stock alerts and the running log of restocks and sales in your sari-sari store.",
      },
      { property: "og:title", content: "Stock — SariSariStock" },
      {
        property: "og:description",
        content: "Low-stock alerts and the running log of restocks and sales.",
      },
    ],
  }),
  component: Stock,
});

const kindLabel = {
  restock: { text: "Restocked", className: "bg-mint/15 text-mint" },
  sale: { text: "Sold", className: "bg-brand/15 text-brand" },
  added: { text: "Added", className: "bg-accent/15 text-accent" },
} as const;

function Stock() {
  const { products, movements } = useInventory();
  const s = summary(products);
  const needs = products.filter((p) => statusOf(p) !== "in");

  return (
    <AppShell>
      <section className="px-6 pt-6 pb-8 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
          Shelf health
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Stock</h1>
      </section>

      <section className="grid grid-cols-2 gap-4 px-6 sm:px-8 lg:grid-cols-4">
        <StatCard label="Need reorder" value={needs.length} tone="amber" note="low or out" />
        <StatCard label="Stock value" value={peso(s.stockValue)} note="at selling price" />
        <StatCard label="Items sold today" value={s.transactions} note="across all products" />
        <StatCard label="Movements logged" value={movements.length} note="today" />
      </section>

      <section className="grid gap-5 px-6 py-8 sm:px-8 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <h2 className="mb-5 font-display text-xl font-semibold">Needs restocking</h2>
          <div className="space-y-2">
            {needs.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.stock} left · alerts at {p.lowAt}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill status={statusOf(p)} />
                  <button
                    onClick={() => restock(p.id, 24)}
                    className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground"
                  >
                    +24
                  </button>
                </div>
              </div>
            ))}
            {needs.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Everything is well stocked.
              </p>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="mb-5 font-display text-xl font-semibold">Movement log</h2>
          <div className="divide-y divide-border">
            {movements.map((m) => {
              const k = kindLabel[m.kind];
              return (
                <div key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.productName}</p>
                    <p className="text-xs text-muted-foreground">{m.at}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${k.className}`}
                  >
                    {k.text} {m.qty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
