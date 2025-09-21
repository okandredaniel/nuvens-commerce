import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders hidden input when name is provided', () => {
    const { container } = render(<Checkbox name="agree" checked value="yes" />);
    const hidden = container.querySelector(
      'input[type="checkbox"][hidden]',
    ) as HTMLInputElement | null;
    expect(hidden).not.toBeNull();
    expect(hidden!.name).toBe('agree');
    expect(hidden!.value).toBe('yes');
    expect(hidden!.checked).toBe(true);
  });
});
