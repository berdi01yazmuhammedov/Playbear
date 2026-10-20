import { ImagePlus, X } from "lucide-react";

import type { ChangeEvent } from "react";

interface MatchingImageUploadProps {
  value?: string;
  alt?: string;

  onChange: (value: string, alt: string) => void;

  onRemove: () => void;
}

export function MatchingImageUpload({
  value,
  alt = "",
  onChange,
  onRemove,
}: MatchingImageUploadProps) {
  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    /*
     * Keep MVP completely backend-free.
     *
     * The image is converted into a data URL,
     * which can be saved in localStorage.
     */

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        return;
      }

      onChange(result, alt);
    };

    reader.readAsDataURL(file);

    /*
     * Allows selecting the same file again.
     */

    event.target.value = "";
  }

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-black/10">
        <div className="aspect-[16/10]">
          <img
            src={value}
            alt={alt || "Uploaded image"}
            className="h-full w-full object-cover"
          />
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-950/80 text-slate-400 backdrop-blur-md transition hover:bg-red-400/10 hover:text-red-300"
          aria-label="Remove image"
        >
          <X size={14} />
        </button>

        <div className="border-t border-white/[0.06] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700">
            Image added
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {alt || "No alt text"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-5 py-10 text-center transition-all hover:border-cyan-300/20 hover:bg-cyan-300/[0.02]">
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={chooseImage}
      />

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] text-slate-600 transition group-hover:scale-105 group-hover:text-cyan-200">
        <ImagePlus size={20} />
      </div>

      <p className="mt-4 text-sm font-bold text-slate-400 transition group-hover:text-white">
        Upload an image
      </p>

      <p className="mt-1 text-xs text-slate-700">PNG, JPG or WEBP</p>
    </label>
  );
}
