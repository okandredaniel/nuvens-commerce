export function applySecurityHeaders(h: Headers, cspHeader: string) {
  h.set('Content-Type', 'text/html');
  h.set('Content-Security-Policy', cspHeader);
  if (!h.has('Referrer-Policy')) h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (!h.has('Permissions-Policy')) {
    h.set(
      'Permissions-Policy',
      'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    );
  }
  return h;
}
