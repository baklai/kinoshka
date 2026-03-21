import { THEME_COLORS } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { DarkTheme, Theme } from '@react-navigation/native';

export type CustomTheme = Theme & {
  colors: {
    primary: string;
    background: string;
    card: string;
    surface?: string;
    text: string;
    subtext?: string;
    border: string;
    focus?: string;
    muted?: string;
    notification: string;
  };
  spacing: (x: number) => number;
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  metrics: {
    headerHeightCompact: number;
    headerHeightLarge: number;
    maxContentWidth: number;
  };
};

export const AppTheme: CustomTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: THEME_COLORS.primary,
    background: THEME_COLORS.background,
    card: THEME_COLORS.surface,
    surface: THEME_COLORS.surface,
    text: THEME_COLORS.text,
    subtext: THEME_COLORS.subtext,
    border: THEME_COLORS.border,
    focus: THEME_COLORS.focus,
    muted: THEME_COLORS.muted,
    notification: THEME_COLORS.primary
  },
  spacing: (x: number) => scaledPixels(8 * x),
  radius: {
    sm: scaledPixels(6),
    md: scaledPixels(10),
    lg: scaledPixels(14),
    xl: scaledPixels(22)
  },
  metrics: {
    headerHeightCompact: scaledPixels(64),
    headerHeightLarge: scaledPixels(88),
    maxContentWidth: scaledPixels(1600)
  }
};
