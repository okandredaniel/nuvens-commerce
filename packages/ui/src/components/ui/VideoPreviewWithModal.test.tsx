import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { VideoPreviewWithModal } from './VideoPreviewWithModal';

const originalPlay = (HTMLMediaElement.prototype as any).play;
const originalPause = (HTMLMediaElement.prototype as any).pause;

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

afterAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: originalPlay,
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: originalPause,
  });
});

describe('VideoPreviewWithModal', () => {
  it('renders image preview by default and opens modal with iframe', async () => {
    render(<VideoPreviewWithModal youtubeId="abc123" />);
    const img = screen.getByRole('img', { name: 'Play video' });
    expect(img).toBeInTheDocument();
    expect((img as HTMLImageElement).src).toContain('/maxresdefault.jpg');
    fireEvent.click(screen.getByRole('button', { name: 'Play video' }));
    const dialog = await screen.findByRole('dialog');
    const iframe = within(dialog).getByTitle('YouTube video') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain('https://www.youtube-nocookie.com/embed/abc123?autoplay=1');
    expect(iframe).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    const closeBtn = within(dialog).getByRole('button');
    fireEvent.click(closeBtn);
    expect(screen.queryByTitle('YouTube video')).toBeNull();
  });

  it('falls back to hqdefault thumbnail on image error', () => {
    render(<VideoPreviewWithModal youtubeId="abc123" />);
    const img = screen.getByRole('img', { name: 'Play video' }) as HTMLImageElement;
    expect(img.src).toContain('/maxresdefault.jpg');
    fireEvent.error(img);
    expect(img.src).toContain('/hqdefault.jpg');
  });

  it('renders video preview and pauses on open then plays on close when autoplay is true', async () => {
    render(<VideoPreviewWithModal youtubeId="abc123" previewSrc="/video.mp4" />);
    const video = document.querySelector('video') as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play video' }));
    await screen.findByRole('dialog');
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
    const dialog = screen.getByRole('dialog');
    const closeBtn = within(dialog).getByRole('button');
    fireEvent.click(closeBtn);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });

  it('does not call play on close when autoplay is false', async () => {
    render(<VideoPreviewWithModal youtubeId="abc123" previewSrc="/video.mp4" autoplay={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play video' }));
    await screen.findByRole('dialog');
    const dialog = screen.getByRole('dialog');
    const closeBtn = within(dialog).getByRole('button');
    fireEvent.click(closeBtn);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('opens via vertical overlay trigger', async () => {
    render(<VideoPreviewWithModal youtubeId="abc123" vertical />);
    const triggers = screen.getAllByRole('button', { name: 'Play video' });
    const overlay = triggers.find((el) => el.tagName === 'DIV')!;
    fireEvent.click(overlay);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('updates thumbnail when youtubeId changes', () => {
    const { rerender } = render(<VideoPreviewWithModal youtubeId="abc123" />);
    const img = screen.getByRole('img', { name: 'Play video' }) as HTMLImageElement;
    expect(img.src).toContain('/abc123/maxresdefault.jpg');
    rerender(<VideoPreviewWithModal youtubeId="xyz789" />);
    expect((screen.getByRole('img', { name: 'Play video' }) as HTMLImageElement).src).toContain(
      '/xyz789/maxresdefault.jpg',
    );
  });

  it('respects custom ariaLabel', () => {
    render(<VideoPreviewWithModal youtubeId="abc123" ariaLabel="Watch video" />);
    expect(screen.getByRole('img', { name: 'Watch video' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Watch video' })).toBeInTheDocument();
  });

  it('sets poster on video when provided', () => {
    render(
      <VideoPreviewWithModal youtubeId="abc123" previewSrc="/video.mp4" poster="/poster.jpg" />,
    );
    const video = document.querySelector('video') as HTMLVideoElement;
    expect(video).toHaveAttribute('poster', '/poster.jpg');
  });

  it('sets iframe src with autoplay=0 when autoplay is false', async () => {
    render(<VideoPreviewWithModal youtubeId="abc123" autoplay={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Play video' }));
    const dialog = await screen.findByRole('dialog');
    const iframe = within(dialog).getByTitle('YouTube video') as HTMLIFrameElement;
    expect(iframe.src).toContain('autoplay=0');
  });
});
