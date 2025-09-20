export function resolvePathname(req: Request) {
  const url = new URL(req.url);
  const isData = url.pathname.endsWith('.data') || url.searchParams.has('_data');
  const raw = isData ? url.pathname.replace(/\.data$/, '') : url.pathname;
  const cleaned = raw === '' || raw === '/.' ? '/' : raw;
  if (cleaned === '/index' || cleaned === '/_root') return '/';
  return cleaned;
}
