import { toLang } from './localize';

export type LanguageInfo = { code: string; label: string };

const AUTONYMS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
};

function looksLikeCode(s: string, code: string): boolean {
  const norm = s.trim();
  const c = code.toLowerCase();
  if (!norm) return true;
  const lower = norm.toLowerCase();
  if (lower === c) return true;
  if (norm.toUpperCase() === c.toUpperCase()) return true;
  if (/^[a-z]{2}(-[a-z]{2})?$/i.test(norm)) return true;
  if (norm.length <= 3 && (lower === c || lower === c.slice(0, 2))) return true;
  return false;
}

export function languageInfo(code: string, uiLang: string, explicit?: string): LanguageInfo {
  const c = toLang(code);
  const useExplicit = explicit && !looksLikeCode(explicit, c) ? explicit : undefined;
  if (useExplicit) return { code: c, label: useExplicit };
  try {
    const dn = new Intl.DisplayNames([uiLang], { type: 'language' });
    const name = dn.of(c);
    if (name) return { code: c, label: name };
  } catch {
    /* empty */
  }
  const fallback = AUTONYMS[c] ?? c.toUpperCase();
  return { code: c, label: fallback };
}

export function languageLabel(code: string, uiLang: string, explicit?: string): string {
  return languageInfo(code, uiLang, explicit).label;
}
