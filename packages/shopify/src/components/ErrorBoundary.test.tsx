import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rr = vi.hoisted(() => ({
  useRouteError: vi.fn(),
  isRouteErrorResponse: vi.fn(),
}));
vi.mock('react-router', () => rr);

vi.mock('./error/NotFound', () => ({
  NotFoundView: () => <div data-testid="nf">404</div>,
}));
vi.mock('./error/ErrorView', () => ({
  ErrorView: (p: any) => (
    <div data-testid="ev">{JSON.stringify({ status: p.status, message: p.message })}</div>
  ),
}));

async function load() {
  vi.resetModules();
  return await import('./ErrorBoundary');
}

function setRoute(error: any, isResponse: boolean) {
  rr.useRouteError.mockReturnValue(error);
  rr.isRouteErrorResponse.mockReturnValue(isResponse);
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders NotFoundView on 404 responses', async () => {
    const { ErrorBoundary } = await load();
    setRoute({ status: 404 }, true);
    render(<ErrorBoundary />);
    expect(screen.getByTestId('nf')).toBeInTheDocument();
  });

  it('renders ErrorView with status and data.message for response errors', async () => {
    const { ErrorBoundary } = await load();
    setRoute({ status: 418, data: { message: 'teapot' } }, true);
    render(<ErrorBoundary />);
    const props = JSON.parse(screen.getByTestId('ev').textContent || '{}');
    expect(props).toEqual({ status: 418, message: 'teapot' });
  });

  it('uses string data when response has string data', async () => {
    const { ErrorBoundary } = await load();
    setRoute({ status: 500, data: 'oops' }, true);
    render(<ErrorBoundary />);
    const props = JSON.parse(screen.getByTestId('ev').textContent || '{}');
    expect(props).toEqual({ status: 500, message: 'oops' });
  });

  it('uses Error.message and defaults status=500 for non-response errors', async () => {
    const { ErrorBoundary } = await load();
    setRoute(new Error('boom'), false);
    render(<ErrorBoundary />);
    const props = JSON.parse(screen.getByTestId('ev').textContent || '{}');
    expect(props).toEqual({ status: 500, message: 'boom' });
  });

  it('uses empty message when non-response is not an Error', async () => {
    const { ErrorBoundary } = await load();
    setRoute({ any: true }, false);
    render(<ErrorBoundary />);
    const props = JSON.parse(screen.getByTestId('ev').textContent || '{}');
    expect(props).toEqual({ status: 500, message: '' });
  });
});
