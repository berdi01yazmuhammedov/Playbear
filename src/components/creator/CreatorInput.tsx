interface CreatorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export function CreatorInput({
  label,
  description,
  className = "",
  ...props
}: CreatorInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">
        {label}
      </span>

      <input
        {...props}
        className={[
          "w-full rounded-xl border border-white/[0.08]",
          "bg-black/10 px-4 py-3 text-sm text-white",
          "outline-none transition-all",
          "placeholder:text-slate-700",
          "focus:border-violet-300/25",
          "focus:bg-white/[0.04]",
          "focus:ring-2 focus:ring-violet-300/[0.05]",
          className,
        ].join(" ")}
      />

      {description && (
        <span className="mt-2 block text-xs text-slate-700">{description}</span>
      )}
    </label>
  );
}
