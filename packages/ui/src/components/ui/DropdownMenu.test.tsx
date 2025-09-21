import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu', () => {
  it('renders content when open', () => {
    render(
      <DropdownMenu.Root open>
        <DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Action</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
