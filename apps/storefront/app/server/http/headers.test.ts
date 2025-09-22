import { describe, expect, it } from 'vitest';
import { applySecurityHeaders, headers as headersFn } from './headers';

function toHeaders(h: Headers | HeadersInit): Headers {
  return h instanceof Headers ? h : new Headers(h);
}

describe('header module', () => {
  it('returns default response headers', () => {
    const h = toHeaders(headersFn({} as any));
    expect(h.get('Cache-Control')).toBe('private, no-store');
    expect(h.get('Vary')).toBe('Cookie');
  });

  it('applySecurityHeaders sets defaults', () => {
    const h = new Headers();
    const out = applySecurityHeaders(h, 'default-csp');
    expect(out).toBe(h);
    expect(h.get('Content-Type')).toBe('text/html');
    expect(h.get('Content-Security-Policy')).toBe('default-csp');
    expect(h.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(h.get('Permissions-Policy')).toBe(
      'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    );
  });

  it('applySecurityHeaders preserves existing Referrer-Policy and Permissions-Policy', () => {
    const h = new Headers();
    h.set('Referrer-Policy', 'no-referrer');
    h.set('Permissions-Policy', 'geolocation=()');
    applySecurityHeaders(h, 'x');
    expect(h.get('Referrer-Policy')).toBe('no-referrer');
    expect(h.get('Permissions-Policy')).toBe(
      'geolocation()' in Object ? 'geolocation=()' : 'geolocation=()',
    );
    expect(h.get('Content-Type')).toBe('text/html');
    expect(h.get('Content-Security-Policy')).toBe('x');
  });
});
