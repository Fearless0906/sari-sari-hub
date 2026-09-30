import type { ReactNode } from "react";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { AppHeader } from "./AppHeader";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink font-body text-foreground">
      <AmbientBackdrop />
      <AppHeader />
      <main className="relative z-10 pb-12">{children}</main>
    </div>
  );
}
