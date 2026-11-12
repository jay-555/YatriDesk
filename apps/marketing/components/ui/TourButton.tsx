"use client";

import { PlayCircle, X } from "lucide-react";
import { useRef } from "react";
import { T } from "@/components/i18n/LanguageProvider";
import { site } from "@/config/site";
import { Button, ButtonLink } from "./Button";

/** "Watch 2-min tour" opens a native modal with the video (or a "coming soon" panel). */
export function TourButton() {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => {
    ref.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => ref.current?.close();

  return (
    <>
      <Button variant="secondary" size="lg" onClick={open} aria-haspopup="dialog">
        <PlayCircle className="size-5 text-brand" aria-hidden />
        <T k="cta.tour" />
      </Button>
      <dialog
        ref={ref}
        aria-labelledby="tour-title"
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
        className="m-auto w-[min(56rem,calc(100vw-2rem))] max-w-none rounded-panel bg-surface p-0 text-fg shadow-lift open:animate-fade"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 id="tour-title" className="font-display text-lg font-bold">
            YatriDesk in 2 minutes
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-bg-alt"
            aria-label="Close video"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="aspect-video bg-ink">
          {site.tourVideoUrl ? (
            <iframe
              src={site.tourVideoUrl}
              title="YatriDesk product tour"
              className="size-full"
              loading="lazy"
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center text-cream">
              <PlayCircle className="size-14 text-saffron" aria-hidden />
              <p className="max-w-md text-lg font-semibold">The product tour video is being recorded.</p>
              <p className="max-w-md text-sm text-cream/70">
                Want to see it sooner? We&apos;ll walk you through YatriDesk live, on your own menu.
              </p>
              <ButtonLink href="/contact#demo" onClick={close}>
                <T k="cta.demo" />
              </ButtonLink>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
