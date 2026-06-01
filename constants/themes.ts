export const THEMES = {
  DARK_ACADEMIA: "dark-academia",
} as const;

export type ThemeName =
  (typeof THEMES)[keyof typeof THEMES];