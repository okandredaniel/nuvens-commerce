import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductGallery } from './ProductGallery';

vi.mock('keen-slider/react.es', () => {
  const instance = {
    track: { details: { rel: 0 } },
    moveToIdx: vi.fn((i: number) => {
      instance.track.details.rel = i;
    }),
  };
  let createdCalled = false;
  return {
    useKeenSlider: (opts?: any) => {
      const ref = (el: any) => {
        if (el && !createdCalled) {
          createdCalled = true;
          opts?.created?.(instance);
        }
      };
      return [ref, { current: instance }];
    },
  };
});

vi.mock('@nuvens/core', () => ({
  ensureVariantFirst: (imgs: any[]) => imgs,
  isValidImage: (img: any) => !!(img && (img.url || img.src)),
}));

const Img = (props: any) => <img alt="alt" {...props} />;

describe('ProductGallery', () => {
  it('shows thumbnails and switches main image on click', async () => {
    const user = userEvent.setup();
    const images = [
      { url: 'http://img/1.jpg', altText: 'One' },
      { url: 'http://img/2.jpg', altText: 'Two' },
    ];

    render(<ProductGallery Image={Img as any} images={images as any} initialIndex={0} />);

    const thumbsOneBefore = screen.getAllByRole('button', { name: 'View One' });
    const thumbsTwoBefore = screen.getAllByRole('button', { name: 'View Two' });

    thumbsOneBefore.forEach((b) => expect(b).toHaveAttribute('aria-pressed', 'true'));
    thumbsTwoBefore.forEach((b) => expect(b).toHaveAttribute('aria-pressed', 'false'));

    await user.click(thumbsTwoBefore[0]);

    await waitFor(() => {
      const thumbsOne = screen.getAllByRole('button', { name: 'View One' });
      const thumbsTwo = screen.getAllByRole('button', { name: 'View Two' });
      thumbsOne.forEach((b) => expect(b).toHaveAttribute('aria-pressed', 'false'));
      thumbsTwo.forEach((b) => expect(b).toHaveAttribute('aria-pressed', 'true'));
    });

    await waitFor(() => {
      const mainImgs = screen.getAllByRole('img');
      const mainTwo = mainImgs.find((el) => el.getAttribute('alt') === 'Two');
      expect(mainTwo).toBeTruthy();
    });
  });
});
