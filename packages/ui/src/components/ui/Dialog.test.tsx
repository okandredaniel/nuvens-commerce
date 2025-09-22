import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog Header & Footer', () => {
  it('renders header with title and description styles and merges className', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content closeLabel="Close">
          <Dialog.Header className="hdr-x">
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Desc</Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const title = screen.getByText('Title');
    const desc = screen.getByText('Desc');
    expect(title).toHaveClass('text-xl', 'font-semibold', 'text-neutral-900');
    expect(desc).toHaveClass('text-sm', 'text-neutral-600');
    const header = title.parentElement as HTMLElement;
    expect(header).toHaveClass('mb-3', 'space-y-1', 'hdr-x');
  });

  it('renders footer with alignment classes, merges className, and hosts actions', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content closeLabel="Close">
          <Dialog.Header>
            <Dialog.Title>Heading</Dialog.Title>
          </Dialog.Header>
          <div>Body</div>
          <Dialog.Footer className="ftr-x">
            <Dialog.Close>Cancel</Dialog.Close>
            <button type="button">Save</button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>,
    );
    const save = screen.getByRole('button', { name: 'Save' });
    const footer = save.parentElement as HTMLElement;
    expect(footer).toHaveClass('mt-6', 'flex', 'items-center', 'justify-end', 'gap-3', 'ftr-x');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('closes dialog when clicking a footer Close action', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Content closeLabel="Close">
          <Dialog.Header>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close>Cancel</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });
});
