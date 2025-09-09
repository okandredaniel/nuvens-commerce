import type { DesignTokens } from '../types';

const REF_RE = /^\{([\w.-]+)\}$/;
const sanitize = (s: string) => s.replace(/\./g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
const toVar = (ref: string) => `var(--${sanitize(ref)})`;

function valToCss(v: unknown): string | null {
  if (typeof v === 'string') {
    const ref = v.match(REF_RE)?.[1];
    return ref ? toVar(ref) : v;
  }
  if (typeof v === 'number') {
    return String(v);
  }
  return null;
}

function deepMerge<A extends Record<string, any>, B extends Record<string, any>>(
  a: A,
  b?: B,
): A & B {
  if (!b) return { ...(a as any) };
  const out: Record<string, any> = Array.isArray(a) ? [...(a as any)] : { ...(a as any) };
  for (const key of Object.keys(b)) {
    const av = (a as any)[key];
    const bv = (b as any)[key];
    if (
      av &&
      bv &&
      typeof av === 'object' &&
      typeof bv === 'object' &&
      !Array.isArray(av) &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMerge(av, bv);
    } else {
      out[key] = bv;
    }
  }
  return out as any;
}

export function tokensToCssVars(tokens: DesignTokens): string[] {
  const out: string[] = [];

  const palette = tokens.palette || {};
  for (const fam of Object.keys(palette).sort()) {
    const shades = palette[fam] || {};
    for (const shade of Object.keys(shades).sort()) {
      const v = valToCss(shades[shade]);
      if (v != null) out.push(`--palette-${sanitize(fam)}-${sanitize(shade)}:${v};`);
    }
  }

  const colors = tokens.colors || {};
  for (const name of Object.keys(colors).sort()) {
    const v = valToCss(colors[name]);
    if (v != null) out.push(`--color-${sanitize(name)}:${v};`);
  }

  for (const group of Object.keys(tokens).sort()) {
    if (group === 'palette' || group === 'colors') continue;
    const root = (tokens as any)[group];
    if (!root || typeof root !== 'object') continue;

    const walk = (node: any, path: string[]) => {
      for (const k of Object.keys(node).sort()) {
        const next = node[k];
        const nextPath = [...path, k];
        if (next && typeof next === 'object' && !Array.isArray(next)) {
          walk(next, nextPath);
        } else {
          const v = valToCss(next);
          if (v != null) {
            out.push(`--${sanitize(group)}-${sanitize(nextPath.join('-'))}:${v};`);
          }
        }
      }
    };

    walk(root, []);
  }

  return out;
}

export function mergeTokens(base: DesignTokens, override?: Partial<DesignTokens>): DesignTokens {
  if (!override) {
    return {
      palette: { ...(base.palette || {}) },
      colors: { ...(base.colors || {}) },
      ...Object.keys(base)
        .filter((k) => k !== 'palette' && k !== 'colors')
        .reduce((acc, k) => ({ ...acc, [k]: (base as any)[k] }), {}),
    } as DesignTokens;
  }

  const merged = deepMerge(base as any, override as any) as DesignTokens;

  merged.palette = deepMerge(base.palette || {}, override.palette || {});
  merged.colors = { ...(base.colors || {}), ...(override.colors || {}) };

  return merged;
}
