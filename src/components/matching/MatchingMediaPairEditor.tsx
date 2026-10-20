import { Image, Type } from "lucide-react";

import type {
  MatchingSide,
  MatchingContentType,
} from "../../features/matching/matching.media.types";

import { MatchingImageUpload } from "./MatchingImageUpload";

interface Props {
  side: MatchingSide;

  label: string;

  onChange: (side: MatchingSide) => void;
}

export function MatchingMediaPairEditor({ side, label, onChange }: Props) {
  function setType(type: MatchingContentType) {
    if (type === "text") {
      onChange({
        type: "text",
        value: side.type === "text" ? side.value : "",
        alt: "",
      });

      return;
    }

    onChange({
      type: "image",
      value: side.type === "image" ? side.value : "",
      alt: side.type === "image" ? side.alt : "",
    });
  }

  function updateText(value: string) {
    onChange({
      ...side,
      type: "text",
      value,
    });
  }

  function updateImage(value: string, alt: string) {
    onChange({
      type: "image",
      value,
      alt,
    });
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-black/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">{label}</p>

        <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.025] p-0.5">
          <button
            type="button"
            onClick={() => setType("text")}
            className={[
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition",
              side.type === "text"
                ? "bg-white text-slate-950"
                : "text-slate-600 hover:text-white",
            ].join(" ")}
          >
            <Type size={11} />
            Text
          </button>

          <button
            type="button"
            onClick={() => setType("image")}
            className={[
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition",
              side.type === "image"
                ? "bg-white text-slate-950"
                : "text-slate-600 hover:text-white",
            ].join(" ")}
          >
            <Image size={11} />
            Image
          </button>
        </div>
      </div>

      {side.type === "text" ? (
        <textarea
          value={side.value}
          onChange={(event) => updateText(event.target.value)}
          rows={3}
          placeholder={label === "Left" ? "dog" : "animal"}
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-700 transition focus:border-cyan-300/30 focus:bg-white/[0.04]"
        />
      ) : (
        <>
          <MatchingImageUpload
            value={side.value}
            alt={side.alt}
            onChange={updateImage}
            onRemove={() =>
              onChange({
                type: "image",
                value: "",
                alt: "",
              })
            }
          />

          <input
            value={side.alt || ""}
            onChange={(event) =>
              onChange({
                ...side,
                alt: event.target.value,
              })
            }
            placeholder="Describe the image"
            className="mt-3 w-full rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/30"
          />
        </>
      )}
    </div>
  );
}
