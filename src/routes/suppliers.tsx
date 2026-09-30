import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getSuppliers } from "@/lib/inventory";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — SariSariStock" },
      {
        name: "description",
        content:
          "Who delivers what to your sari-sari store: contacts, categories supplied and last delivery.",
      },
      { property: "og:title", content: "Suppliers — SariSariStock" },
      {
        property: "og:description",
        content: "Supplier contacts, categories supplied and last delivery dates.",
      },
    ],
  }),
  component: Suppliers,
});

function Suppliers() {
  const suppliers = getSuppliers();

  return (
    <AppShell>
      <section className="px-6 pt-6 pb-8 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
          Deliveries
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Suppliers</h1>
      </section>

      <section className="grid gap-4 px-6 sm:px-8 lg:grid-cols-3">
        {suppliers.map((s) => (
          <div key={s.id} className="glass rounded-3xl p-6">
            <p className="font-display text-xl font-semibold">{s.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.contact}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Last delivery · {s.lastDelivery}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
