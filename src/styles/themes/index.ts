export const THEMES = ["style1", "style2", "style3"] as const;
export type ThemeName = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeName = "style2";

export function resolveTheme(raw: string | null | undefined): ThemeName {
  if (raw && (THEMES as readonly string[]).includes(raw)) return raw as ThemeName;
  return DEFAULT_THEME;
}
