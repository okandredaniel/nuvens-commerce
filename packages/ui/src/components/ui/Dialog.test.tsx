import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('opens and closes via trigger and close button', async () => {
    render(
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content closeLabel="Close">
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Desc</Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>,
    );
    fireEvent.click(screen.getByText('Open'));
    expect(await screen.findByText('Title')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });
});
