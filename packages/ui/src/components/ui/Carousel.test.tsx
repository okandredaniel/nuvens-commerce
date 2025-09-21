import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Carousel, CarouselI18n, CarouselSlide } from './Carousel';

vi.mock('keen-slider/react.es', () => {
  const instance = { next: vi.fn(), prev: vi.fn(), moveToIdx: vi.fn() };
  return { useKeenSlider: () => [() => {}, { current: instance }] };
});

const i18n: CarouselI18n = {
  label: 'Gallery',
  previous: 'Previous',
  next: 'Next',
  goTo: (i: number) => `Go to ${i}`,
  status: (i: number, total: number) => `${i} of ${total}`,
};

describe('Carousel', () => {
  it('renders dots and moves to index on dot click', () => {
    render(
      <Carousel i18n={i18n}>
        <CarouselSlide>1</CarouselSlide>
        <CarouselSlide>2</CarouselSlide>
        <CarouselSlide>3</CarouselSlide>
      </Carousel>,
    );
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);
    fireEvent.click(dots[2]);
    expect(dots[2]).toHaveAttribute('aria-label', 'Go to 3');
  });
});
