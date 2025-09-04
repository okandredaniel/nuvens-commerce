import type { DesignTokens } from '.';

const REF_RE = /^\{([\w.-]+)\}$/;
const toVar = (ref: string) => `var(--${ref.replace(/\./g, '-').replace(/[^a-zA-Z0-9-_]/g, '')})`;

export function tokensToCssVars(tokens: DesignTokens): string[] {
  const out: string[] = [];

  for (const fam of Object.keys(tokens.palette || {})) {
    const shades = tokens.palette[fam]!;
    for (const shade of Object.keys(shades)) {
      out.push(`--palette-${fam}-${shade}:${shades[shade]};`);
    }
  }

  for (const name of Object.keys(tokens.colors || {})) {
    const raw = tokens.colors[name]!;
    const ref = typeof raw === 'string' ? raw.match(REF_RE)?.[1] : null;
    out.push(`--color-${name}:${ref ? toVar(ref) : raw};`);
  }

  return out;
}

export function mergeTokens(base: DesignTokens, override?: Partial<DesignTokens>): DesignTokens {
  const merged: DesignTokens = {
    palette: { ...(base.palette || {}) },
    colors: { ...(base.colors || {}) },
  };
  if (!override) return merged;

  if (override.palette) {
    for (const fam of Object.keys(override.palette)) {
      merged.palette[fam] = {
        ...(merged.palette[fam] || {}),
        ...override.palette[fam]!,
      };
    }
  }
  if (override.colors) {
    merged.colors = { ...merged.colors, ...override.colors };
  }
  return merged;
}
