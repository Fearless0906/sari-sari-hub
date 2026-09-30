import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  note?: string;
  tone?: "default" | "amber" | "mint";
}) {
  const valueTone =
    tone === "amber" ? "text-amber" : tone === "mint" ? "text-mint" : "text-foreground";

  return (
    <div className="glass-strong rounded-2xl p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${valueTone}`}>{value}</p>
      {note ? <p className="mt-1 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}
