export function languageLabel(code: string, uiLang: string, explicit?: string) {
  if (explicit) return explicit;
  try {
    const dn = new Intl.DisplayNames([uiLang], { type: 'language' });
    return dn.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}
