import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Aside, useAside } from './Aside';

function Controls() {
  const { open, close } = useAside();
  return (
    <div>
      <button onClick={() => open('cart')}>Open Cart</button>
      <button onClick={() => open('mobile')}>Open Mobile</button>
      <button onClick={() => close()}>Close Aside</button>
    </div>
  );
}

describe('Aside', () => {
  it('throws when useAside is used outside provider', () => {
    function BadConsumer() {
      useAside();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow('useAside must be used within an Aside.Provider');
  });

  it('opens the cart aside and renders title and children', async () => {
    render(
      <Aside.Provider>
        <Controls />
        <Aside type="cart" heading="Your Cart">
          <div>Cart Content</div>
        </Aside>
      </Aside.Provider>,
    );
    fireEvent.click(screen.getByText('Open Cart'));
    const dialog = await screen.findByRole('dialog');
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Cart Content')).toBeInTheDocument();
    expect(dialog.className).toContain('right-0');
    expect(dialog.className).toContain('w-[92vw] sm:w-[420px]');
  });

  it('closes the aside via context close()', async () => {
    render(
      <Aside.Provider>
        <Controls />
        <Aside type="cart" heading="Cart">
          <div>Body</div>
        </Aside>
      </Aside.Provider>,
    );
    fireEvent.click(screen.getByText('Open Cart'));
    await screen.findByRole('dialog');
    fireEvent.click(screen.getByText('Close Aside'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('closes the aside via Sheet close button', async () => {
    render(
      <Aside.Provider>
        <Controls />
        <Aside type="cart" heading="Cart">
          <div>Body</div>
        </Aside>
      </Aside.Provider>,
    );
    fireEvent.click(screen.getByText('Open Cart'));
    const dialog = await screen.findByRole('dialog');
    const closeBtn = within(dialog).getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('computes width classes for mobile and applies left side', async () => {
    render(
      <Aside.Provider>
        <Controls />
        <Aside type="mobile" side="left" heading="Menu">
          <div>Mobile Body</div>
        </Aside>
      </Aside.Provider>,
    );
    fireEvent.click(screen.getByText('Open Mobile'));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.className).toContain('left-0');
    expect(dialog.className).toContain('w-[90vw] max-w-sm');
  });

  it('uses custom widthClass when provided', async () => {
    render(
      <Aside.Provider>
        <Controls />
        <Aside type="cart" heading="Custom Width" widthClass="w-[480px]">
          <div>Custom Body</div>
        </Aside>
      </Aside.Provider>,
    );
    fireEvent.click(screen.getByText('Open Cart'));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.className).toContain('w-[480px]');
  });
});
