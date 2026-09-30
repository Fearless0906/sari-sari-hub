import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatusPill } from "@/components/StatusPill";
import {
  CATEGORIES,
  addProduct,
  peso,
  recordSale,
  restock,
  statusOf,
  useInventory,
} from "@/lib/inventory";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — SariSariStock" },
      {
        name: "description",
        content:
          "Search your sari-sari store products, add new items, restock fast and record sales.",
      },
      { property: "og:title", content: "Products — SariSariStock" },
      {
        property: "og:description",
        content: "Search, add, restock and sell items from your store inventory.",
      },
    ],
  }),
  component: Products,
});

function Products() {
  const { products } = useInventory();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0] as string,
    price: "",
    stock: "",
    lowAt: "",
  });

  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const canSave = form.name.trim() !== "" && form.price !== "" && form.stock !== "";

  return (
    <AppShell>
      <section className="px-6 pt-6 pb-8 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
          Catalogue
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Products
        </h1>
      </section>

      <section className="grid gap-5 px-6 sm:px-8 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="min-w-48 flex-1 rounded-full border border-border bg-secondary px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
            />
            <div className="flex flex-wrap gap-1 rounded-full border border-border bg-secondary p-1">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === c
                      ? "bg-brand text-brand-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
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
                  <th className="pb-3 text-right font-medium">Quick</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.category}</td>
                    <td className="py-3 text-right font-display">{p.stock}</td>
                    <td className="py-3 text-right">{peso(p.price)}</td>
                    <td className="py-3 text-right">
                      <StatusPill status={statusOf(p)} />
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => restock(p.id, 10)}
                          className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => restock(p.id, 50)}
                          className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => recordSale(p.id, 1)}
                          disabled={p.stock < 1}
                          className="rounded-lg bg-brand/20 px-2.5 py-1 text-xs font-medium text-brand transition-colors hover:bg-brand/30 disabled:opacity-30"
                        >
                          Sell 1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      No products match that search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSave) return;
            addProduct({
              name: form.name.trim(),
              category: form.category,
              price: Number(form.price),
              stock: Number(form.stock),
              lowAt: Number(form.lowAt || 10),
            });
            setForm({ name: "", category: CATEGORIES[0], price: "", stock: "", lowAt: "" });
          }}
          className="glass h-fit rounded-3xl p-6"
        >
          <h2 className="font-display text-xl font-semibold">Add product</h2>
          <p className="mt-1 text-xs text-muted-foreground">Goes straight to the shelf list.</p>

          <div className="mt-5 space-y-3">
            <Field label="Product name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Kopiko Sachet"
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-brand"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-ink-2">
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₱)">
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  inputMode="numeric"
                  placeholder="15"
                  className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
                />
              </Field>
              <Field label="Quantity">
                <input
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
                />
              </Field>
            </div>
            <Field label="Low-stock alert at">
              <input
                value={form.lowAt}
                onChange={(e) => setForm({ ...form, lowAt: e.target.value })}
                inputMode="numeric"
                placeholder="10"
                className="w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
              />
            </Field>
            <button
              type="submit"
              disabled={!canSave}
              className="w-full rounded-xl bg-brand py-2.5 font-display text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 disabled:opacity-40"
            >
              Save to inventory
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
