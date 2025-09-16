import { cn } from '@nuvens/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  previewSrc?: string;
  youtubeId: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
  vertical?: boolean;
  autoplay?: boolean;
};

export function VideoPreviewWithModal({
  previewSrc,
  youtubeId,
  poster,
  className,
  ariaLabel = 'Play video',
  vertical = false,
  autoplay = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(
    `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
  );

  useEffect(() => {
    setImgSrc(`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`);
  }, [youtubeId]);

  const embedUrl = useMemo(
    () =>
      `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`,
    [youtubeId, autoplay],
  );

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    const v = videoRef.current;
    if (!v) return;
    if (next) {
      v.pause();
    } else if (autoplay) {
      v.play().catch(() => {});
    }
  };

  const previewAspect = vertical ? 'pt-[177.78%]' : 'pt-[45%] md:pt-[40%]';
  const playBtnSize = vertical ? 'h-12 w-12 md:h-16 md:w-16' : 'h-16 w-16 md:h-32 md:w-32';
  const playIconSize = vertical ? 'h-6 w-6 md:h-8 md:w-8' : 'h-10 w-10';
  const ratioClass = vertical ? 'aspect-[9/16]' : 'aspect-video';
  const maxBoxClass = vertical
    ? 'w-[92vw] max-w-[min(92vw,calc(90vh*9/16))]'
    : 'w-[92vw] max-w-[min(92vw,calc(90vh*16/9))]';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <div className={cn('bg-slate-100 relative w-full', previewAspect, className)}>
        {previewSrc ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={previewSrc}
            poster={poster}
            muted
            loop
            autoPlay={autoplay}
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
          />
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={imgSrc}
            alt={ariaLabel}
            loading="lazy"
            decoding="async"
            onError={() => {
              if (!imgSrc.includes('hqdefault.jpg')) {
                setImgSrc(`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`);
              }
            }}
          />
        )}

        {vertical && (
          <Dialog.Trigger asChild>
            <div
              className="absolute inset-0 cursor-pointer"
              role="button"
              aria-label={ariaLabel}
              tabIndex={0}
            />
          </Dialog.Trigger>
        )}

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label={ariaLabel}
              className={cn(
                'pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur ring-1 ring-white/40 shadow-2xl transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                playBtnSize,
              )}
            >
              <Play className={cn('text-white drop-shadow', playIconSize)} />
            </button>
          </Dialog.Trigger>
        </div>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[color:var(--palette-primary-600)]/40 backdrop-blur-xs data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[61] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black p-0 shadow-xl focus:outline-none">
          <div className="flex max-h-[90vh] w-full items-center justify-center p-0">
            <div className={cn('relative overflow-hidden rounded-2xl', ratioClass, maxBoxClass)}>
              {open && (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={embedUrl}
                  title="YouTube video"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                />
              )}
            </div>
          </div>
          <Dialog.Close className="absolute right-3 top-3 rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
