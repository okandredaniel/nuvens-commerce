import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FeedbackArea } from './FeedbackArea';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'status.loading') return 'Loading';
      return k;
    },
  }),
}));

const baseFetcher = (data: any = null) => ({ data }) as any;

describe('FeedbackArea', () => {
  it('renders loading status', () => {
    render(
      <FeedbackArea
        fetcher={baseFetcher()}
        loading
        success={false}
        error={false}
        successText="Applied"
        errorText="Invalid"
      />,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading');
  });

  it('renders success status with provided text', () => {
    render(
      <FeedbackArea
        fetcher={baseFetcher()}
        loading={false}
        success
        error={false}
        successText="Applied"
        errorText="Invalid"
      />,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Applied');
  });

  it('renders simple error with provided text when error is true and no server errors', () => {
    render(
      <FeedbackArea
        fetcher={baseFetcher()}
        loading={false}
        success={false}
        error
        successText="Applied"
        errorText="Invalid"
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid');
  });

  it('renders server errors from string array', () => {
    const fetcher = baseFetcher({ errors: ['Code already used', 'Expired code'] });
    render(
      <FeedbackArea
        fetcher={fetcher}
        loading={false}
        success={false}
        error={false}
        successText="Applied"
        errorText="Invalid"
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Code already used');
    expect(alert).toHaveTextContent('Expired code');
    expect(alert.querySelectorAll('li').length).toBe(2);
  });

  it('renders server errors from object array with message field', () => {
    const fetcher = baseFetcher({
      errors: [{ message: 'Invalid format' }, { message: 'Unknown' }],
    });
    render(
      <FeedbackArea
        fetcher={fetcher}
        loading={false}
        success={false}
        error={false}
        successText="Applied"
        errorText="Invalid"
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Invalid format');
    expect(alert).toHaveTextContent('Unknown');
    expect(alert.querySelectorAll('li').length).toBe(2);
  });

  it('renders nothing when not loading, no success, no error, and no server errors', () => {
    const { container } = render(
      <FeedbackArea
        fetcher={baseFetcher()}
        loading={false}
        success={false}
        error={false}
        successText="Applied"
        errorText="Invalid"
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
