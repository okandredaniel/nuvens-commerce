import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders single mode with default open', () => {
    const items = [
      { id: 'a', title: 'A', content: 'Content A' },
      { id: 'b', title: 'B', content: 'Content B' },
    ];

    const { container } = render(
      <Accordion type="single" items={items} ariaToggleLabel="Toggle" defaultValue="a" />,
    );

    const openPanel = container.querySelector('[data-state="open"]');
    expect(openPanel).toBeTruthy();
    expect(openPanel?.textContent).toContain('Content A');

    const bOpen = screen.queryByText('Content B')?.closest('[data-state="open"]');
    expect(bOpen).toBeNull();

    const bPanel = screen.getByText('Content B').closest('[data-state]');
    expect(bPanel).toHaveAttribute('data-state', 'closed');
  });
});
