"use client";

import { useState } from "react";
import { Play, X, Film } from "lucide-react";
import { SITE } from "@/lib/site/config";

/** Convert a YouTube/Vimeo watch URL into an embeddable URL. */
function toEmbed(url: string): { kind: "iframe" | "file"; src: string } {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtu.be") {
      return { kind: "iframe", src: `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1` };
    }
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return { kind: "iframe", src: `https://www.youtube.com/embed/${id}?autoplay=1` };
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return { kind: "iframe", src: `https://player.vimeo.com/video/${id}?autoplay=1` };
    }
  } catch {
    /* fall through to file */
  }
  return { kind: "file", src: url };
}

/**
 * Intro video. Reads SITE.video. When a URL is present it shows a poster with a
 * play button that opens a modal player. Until then it shows an intentional,
 * on-brand placeholder so the section still reads as finished.
 */
export function VideoFeature({
  eyebrow = "Watch the 2-minute intro",
  heading,
  className = "",
}: {
  eyebrow?: string;
  heading?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { url, title, caption, poster } = SITE.video;
  const hasVideo = Boolean(url);
  const embed = url ? toEmbed(url) : null;

  return (
    <section className={`bg-paper-soft ${className}`}>
      <div className="container py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{heading ?? title}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">{caption}</p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <button
            type="button"
            onClick={() => hasVideo && setOpen(true)}
            disabled={!hasVideo}
            className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-line-strong bg-ink-900 shadow-lift"
            aria-label={hasVideo ? `Play: ${title}` : "Intro video coming soon"}
          >
            {/* Poster */}
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ink-700 to-ink-900">
                <div className="bg-grid absolute inset-0 opacity-20" />
              </div>
            )}

            {/* Brand watermark */}
            <div className="absolute left-5 top-5 flex items-center gap-2 text-white/80">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-xs font-bold ring-1 ring-white/20">
                {SITE.monogram}
              </span>
              <span className="text-sm font-semibold tracking-tight">{SITE.brand}</span>
            </div>

            {/* Play / placeholder */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-ink shadow-lift transition group-hover:scale-105 group-disabled:opacity-70">
                  {hasVideo ? <Play className="h-8 w-8 translate-x-0.5 fill-ink" /> : <Film className="h-8 w-8" />}
                </span>
                <span className="mt-4 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {hasVideo ? title : "Intro video coming soon"}
                </span>
              </div>
            </div>
          </button>
          {!hasVideo && (
            <p className="mt-3 text-center text-xs text-slate-400">
              The intro film drops in here as soon as it is ready. No code change needed, just a video link.
            </p>
          )}
        </div>
      </div>

      {/* Modal player */}
      {open && embed && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 inline-flex items-center gap-1 text-sm text-white/90 hover:text-white"
              aria-label="Close video"
            >
              <X className="h-5 w-5" /> Close
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lift">
              {embed.kind === "iframe" ? (
                <iframe
                  src={embed.src}
                  title={title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={embed.src} controls autoPlay className="h-full w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
