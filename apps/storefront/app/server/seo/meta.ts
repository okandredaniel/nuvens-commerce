import { buildCanonical, buildHreflangs } from '~/lib/seo';

export function buildMetaLinks(base: string, pathname: string, search: string) {
  const canonical = buildCanonical(base, pathname, search);
  const alts = buildHreflangs(base, pathname, search);
  return [
    { tagName: 'link', rel: 'canonical', href: canonical },
    ...alts.map((a) => ({ tagName: 'link', rel: 'alternate', hrefLang: a.hrefLang, href: a.href })),
  ];
}
