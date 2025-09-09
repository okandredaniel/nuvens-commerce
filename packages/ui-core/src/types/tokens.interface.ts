export type Palette = Record<string, Record<string, string>>;

export type SemanticColors = Record<string, string>;

export type DesignTokens = { palette: Palette; colors: SemanticColors };

export interface TokensInterface {
  colors: Record<string, string>;
}

export type BrandId = 'cosmos' | 'naturalex' | 'wooly' | 'zippex';
