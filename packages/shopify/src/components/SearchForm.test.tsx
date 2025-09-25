import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router', () => {
  const Form = ({ children, ...rest }: any) => <form {...rest}>{children}</form>;
  return { Form };
});

import { SearchForm } from './SearchForm';

describe('SearchForm', () => {
  it('returns null when children is not a function', () => {
    const { container } = render(
      // @ts-expect-error testing non-function children case
      <SearchForm>not-a-function</SearchForm>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a form with method=get and forwards extra props', () => {
    const { container } = render(
      <SearchForm action="/search?x=1" className="k">
        {() => null}
      </SearchForm>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('method', 'get');
    expect(form).toHaveAttribute('action', '/search?x=1');
    expect(form).toHaveClass('k');
  });

  it('provides inputRef to children render prop', () => {
    render(
      <SearchForm>
        {({ inputRef }) => <input ref={inputRef} data-testid="q" name="q" />}
      </SearchForm>,
    );
    const input = screen.getByTestId('q') as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it('focuses the input on Cmd+K and blurs on Escape', () => {
    render(
      <SearchForm>
        {({ inputRef }) => <input ref={inputRef} data-testid="q" name="q" />}
      </SearchForm>,
    );
    const input = screen.getByTestId('q') as HTMLInputElement;

    expect(document.activeElement).not.toBe(input);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(document.activeElement).toBe(input);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).not.toBe(input);
  });

  it('renders children inside the form', () => {
    render(
      <SearchForm>
        {({ inputRef }) => (
          <>
            <input ref={inputRef} data-testid="q" />
            <button type="submit">Search</button>
          </>
        )}
      </SearchForm>,
    );
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByTestId('q')).toBeInTheDocument();
  });
});
