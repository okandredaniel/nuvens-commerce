import type { i18n } from 'i18next';

const attached = new WeakSet<i18n>();

export function attachI18nDiagnostics(instance: i18n, windowMs = 1200) {
  if (attached.has(instance)) return;
  attached.add(instance);

  const counts = new Map<string, number>();
  const timers = new Map<string, number>();

  instance.on('missingKey', (lngs, ns, key) => {
    const lang = Array.isArray(lngs) ? lngs[0] : lngs || instance.language || 'en';
    const id = lang + '|' + ns + '|' + key;
    counts.set(id, (counts.get(id) || 0) + 1);
    if (!timers.has(id)) {
      const t = setTimeout(() => {
        const n = counts.get(id) || 1;
        counts.delete(id);
        timers.delete(id);
        const label = `[i18n] Missing: ${ns}:${key} (${lang}) ×${n}`;
        if (typeof console !== 'undefined') console.warn(label);
      }, windowMs) as unknown as number;
      timers.set(id, t);
    }
  });
}

export function createI18nextLogger() {
  const seen = new Map<string, number>();
  const ttl = 1500;

  function emit(level: 'log' | 'warn' | 'error', args: any[]) {
    const str = args.map((a) => (typeof a === 'string' ? a : String(a))).join(' ');
    if (str.includes('i18next::translator: missingKey')) return;
    const now = Date.now();
    const last = seen.get(str) || 0;
    if (now - last < ttl) return;
    seen.set(str, now);
    // @ts-ignore
    (console[level] || console.log)(...args);
  }

  return {
    type: 'logger' as const,
    log: (...args: any[]) => emit('log', args),
    warn: (...args: any[]) => emit('warn', args),
    error: (...args: any[]) => emit('error', args),
  };
}
