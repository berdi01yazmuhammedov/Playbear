import type { ReactNode } from "react";

interface PlayBearGameBackgroundProps {
  children: ReactNode;
}

export function PlayBearGameBackground({
  children,
}: PlayBearGameBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.06] blur-[120px]" />

        <div className="absolute right-[-180px] top-[15%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.07] blur-[140px]" />

        <div className="absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full bg-sky-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
