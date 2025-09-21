import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RatingStars } from './RatingStars';

function getOverlay(container: HTMLElement) {
  return container.querySelector('[aria-hidden="true"][style]') as HTMLElement;
}

describe('RatingStars', () => {
  it.each([0, 1, 2, 3, 4, 5])('sets width percent for value %s', (value) => {
    const { container } = render(<RatingStars value={value} ariaLabel="rating" />);
    const overlay = getOverlay(container);
    expect(overlay).toBeTruthy();
    expect(overlay.style.width).toBe(`${value * 20}%`);
  });

  it.each([-1, -5, Number.NEGATIVE_INFINITY])('clamps low values (%s) to 0%', (value) => {
    const { container } = render(<RatingStars value={value} ariaLabel="rating" />);
    const overlay = getOverlay(container);
    expect(overlay).toBeTruthy();
    expect(overlay.style.width).toBe('0%');
  });

  it.each([6, 999, Number.POSITIVE_INFINITY])('clamps high values (%s) to 100%', (value) => {
    const { container } = render(<RatingStars value={value} ariaLabel="rating" />);
    const overlay = getOverlay(container);
    expect(overlay).toBeTruthy();
    expect(overlay.style.width).toBe('100%');
  });
});
