import { cn } from '@nuvens/ui-core';
import * as Dialog from '@radix-ui/react-dialog';
import { Play } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

type Props = {
  previewSrc: string;
  youtubeId: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
};

export function VideoPreviewWithModal({
  previewSrc,
  youtubeId,
  poster,
  className,
  ariaLabel = 'Play video',
}: Props) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const embedUrl = useMemo(
    () =>
      `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
    [youtubeId],
  );

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    const v = videoRef.current;
    if (!v) return;
    if (next) v.pause();
    else v.play().catch(() => {});
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <div className={cn('relative w-full pt-[45%] md:pt-[40%]', className)}>
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={previewSrc}
          poster={poster}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
        />
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label={ariaLabel}
              className="pointer-events-auto inline-flex h-16 w-16 md:h-32 md:w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur ring-1 ring-white/40 shadow-2xl transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Play className="h-10 w-10 text-white drop-shadow" />
            </button>
          </Dialog.Trigger>
        </div>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[color:var(--palette-primary-600)]/40 backdrop-blur-xs data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-black shadow-xl focus:outline-none">
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title="YouTube video"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <Dialog.Close className="absolute right-3 top-3 rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
