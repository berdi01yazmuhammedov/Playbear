import type { ReactNode } from "react";

interface CreatorSectionProps {
  title: string;
  description?: string;
  count?: string;
  children: ReactNode;
  className?: string;
}

export function CreatorSection({
  title,
  description,
  count,
  children,
  className = "",
}: CreatorSectionProps) {
  return (
    <section
      className={[
        "rounded-[1.75rem] border border-white/[0.07]",
        "bg-white/[0.035] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.16)]",
        "sm:p-6",
        className,
      ].join(" ")}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </p>

          {description && (
            <p className="mt-1.5 text-xs leading-5 text-slate-600">
              {description}
            </p>
          )}
        </div>

        {count && (
          <div className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-slate-500">
            {count}
          </div>
        )}
      </div>

      {children}
    </section>
  );
}
