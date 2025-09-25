import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  cn: (...cls: string[]) => cls.filter(Boolean).join(' '),
}));

import { RichText } from './RichText';

describe('RichText', () => {
  it('returns null when html is empty', () => {
    const { container } = render(<RichText html="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders article with default and custom classes', () => {
    render(<RichText html="<p>hello</p>" className="prose extra" />);
    const art = screen.getByRole('article');
    expect(art).toBeInTheDocument();
    expect(art).toHaveClass('rte');
    expect(art).toHaveClass('prose');
    expect(art).toHaveClass('extra');
  });

  it('sets innerHTML via dangerouslySetInnerHTML', () => {
    const html = '<p><strong>Hi</strong> there &amp; welcome</p>';
    render(<RichText html={html} />);
    const art = screen.getByRole('article');
    expect(art.innerHTML).toBe(html);
  });
});
