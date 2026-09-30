import type { StockStatus } from "@/lib/inventory";

const map: Record<StockStatus, { label: string; className: string }> = {
  in: { label: "In stock", className: "bg-mint/15 text-mint" },
  low: { label: "Low", className: "bg-amber/15 text-amber" },
  out: { label: "Out", className: "bg-rose/15 text-rose" },
};

export function StatusPill({ status }: { status: StockStatus }) {
  const s = map[status];
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}
