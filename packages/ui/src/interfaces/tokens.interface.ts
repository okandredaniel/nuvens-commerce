export type Palette = Record<string, Record<string, string>>;
export type SemanticColors = Record<string, string>;

export interface DesignTokens {
  palette?: Palette;
  colors?: SemanticColors;
  [key: string]: unknown;
}
