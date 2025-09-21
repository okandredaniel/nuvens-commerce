import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows content when controlled open', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content>Help text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const t = await screen.findByRole('tooltip');
    expect(t).toHaveTextContent('Help text');
  });
});
