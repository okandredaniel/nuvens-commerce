export function resolvePathname(req: Request) {
  const url = new URL(req.url);
  let pathname = url.pathname || '/';
  const isData = pathname.endsWith('.data') || url.searchParams.has('_data');
  if (isData) {
    const ref = req.headers.get('referer');
    if (ref) {
      try {
        pathname = new URL(ref).pathname || '/';
      } catch {
        pathname = '/';
      }
    } else {
      pathname = '/';
    }
  }
  return pathname;
}
