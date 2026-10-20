import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";

interface PlayBearButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)] hover:bg-slate-100 hover:-translate-y-0.5",
  secondary:
    "border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1] hover:border-white/15",
  ghost: "text-slate-400 hover:bg-white/[0.06] hover:text-white",
  danger:
    "border border-red-400/10 bg-red-400/[0.06] text-red-300 hover:bg-red-400/[0.1]",
  success:
    "bg-emerald-400 text-emerald-950 shadow-[0_10px_30px_rgba(52,211,153,0.18)] hover:bg-emerald-300",
};

export function PlayBearButton({
  variant = "primary",
  children,
  icon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: PlayBearButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        "group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5",
        "text-sm font-semibold",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {icon && (
        <span className="transition-transform duration-200 group-hover:scale-105">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </button>
  );
}
