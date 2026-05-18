export const THEMES = ["style1"] as const;
export type ThemeName = (typeof THEMES)[number];
export const DEFAULT_THEME: ThemeName = "style1";

export function resolveTheme(raw: string | null | undefined): ThemeName {
  if (raw && (THEMES as readonly string[]).includes(raw)) return raw as ThemeName;
  return DEFAULT_THEME;
}
