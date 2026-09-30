import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import {
  categoryBreakdown,
  peso,
  statusOf,
  summary,
  useInventory,
} from "@/lib/inventory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SariSariStock" },
      {
        name: "description",
        content:
          "Live view of your sari-sari store: total SKUs, low-stock alerts, stock value and today's sales.",
      },
      { property: "og:title", content: "Dashboard — SariSariStock" },
      {
        property: "og:description",
        content: "Live view of your sari-sari store stock, alerts and daily sales.",
      },
    ],
  }),
  component: Dashboard,
});

const barTones = ["bg-brand", "bg-accent", "bg-mint", "bg-rose"];

function Dashboard() {
  const { products, movements } = useInventory();
  const s = summary(products);
  const breakdown = categoryBreakdown(products);
  const topSeller = [...products].sort((a, b) => b.soldToday - a.soldToday)[0];
  const maxSold = topSeller?.soldToday || 1;
  const recent = products
    .filter((p) => movements.some((m) => m.productName === p.name))
    .concat(products)
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, 6);

  return (
    <AppShell>
      <section className="px-6 pt-6 pb-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              Live inventory
            </p>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
              Every item,
              <br />
              tracked to the <span className="text-brand">last pack</span>.
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-brand px-5 py-3 font-display text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20"
            >
              + Add product
            </Link>
            <Link
              to="/stock"
              className="rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Stock movements
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 px-6 sm:px-8 lg:grid-cols-4">
        <StatCard label="Total SKUs" value={s.totalSkus} note="products on shelf" />
        <StatCard label="Low stock" value={s.lowStock} note="need reorder" tone="amber" />
        <StatCard label="Stock value" value={peso(s.stockValue)} note="at selling price" />
        <StatCard
          label="Sold today"
          value={peso(s.soldToday)}
          note={`${s.transactions} items`}
        />
      </section>

      <section className="grid gap-5 px-6 py-8 sm:px-8 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent stock movements</h2>
            <span className="text-xs text-muted-foreground">Last 24 hours</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 text-right font-medium">Stock</th>
                  <th className="pb-3 text-right font-medium">Price</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recent.map((p) => (
                  <tr key={p.id} className="hover:bg-muted">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.category}</td>
                    <td className="py-3 text-right font-display">{p.stock}</td>
                    <td className="py-3 text-right">{peso(p.price)}</td>
                    <td className="py-3 text-right">
                      <StatusPill status={statusOf(p)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-brand/20 to-accent/20 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Top seller</p>
            <p className="mt-1 font-display text-2xl font-bold">{topSeller?.name ?? "—"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {topSeller?.soldToday ?? 0} units sold today
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-[width] duration-500"
                style={{ width: `${Math.min(100, ((topSeller?.soldToday ?? 0) / maxSold) * 100)}%` }}
              />
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
              Category breakdown
            </p>
            <div className="space-y-3">
              {breakdown.map((b, i) => (
                <div key={b.category}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{b.category}</span>
                    <span className="text-muted-foreground">{b.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${barTones[i % barTones.length]}`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
