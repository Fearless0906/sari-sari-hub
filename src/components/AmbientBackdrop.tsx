export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-brand/25 blur-[120px] animate-drift" />
      <div className="absolute top-1/3 -right-40 size-[560px] rounded-full bg-accent/25 blur-[130px] animate-drift2" />
      <div className="absolute -bottom-40 left-1/3 size-[480px] rounded-full bg-mint/15 blur-[120px] animate-drift3" />
      <div className="absolute inset-0 opacity-[0.04] grid-lines" />
    </div>
  );
}
