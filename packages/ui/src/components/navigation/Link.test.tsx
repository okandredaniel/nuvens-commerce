import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Link, NavLink } from './Link';

vi.mock('@nuvens/core', () => ({
  useCoreAdapter: () => ({
    Link: (props: any) => <a {...props}>{props.children}</a>,
    NavLink: (props: any) => <a {...props}>{props.children}</a>,
  }),
}));

describe('Link', () => {
  it('renders anchor with base styles', () => {
    render(<Link to="/x">Go</Link>);
    const a = screen.getByRole('link', { name: 'Go' });
    expect(a).toHaveAttribute('href', '/x');
    expect(a.className).toMatch(/underline/);
  });

  it('renders NavLink', () => {
    render(<NavLink to="/y">To</NavLink>);
    expect(screen.getByRole('link', { name: 'To' })).toHaveAttribute('href', '/y');
  });
});
