import { DarkTheme, Theme } from '@react-navigation/native';

import { THEME_COLORS } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';

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
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  iconSize: {
    small: number;
    normal: number;
    large: number;
    xlarge: number;
  };
  metrics: {
    headerHeightCompact: number;
    headerHeightLarge: number;
    maxContentWidth: number;
    tabBarHeight: number;
    hairline: number;
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
    xs: scaledPixels(3),
    sm: scaledPixels(6),
    md: scaledPixels(10),
    lg: scaledPixels(14),
    xl: scaledPixels(22),
    full: 9999
  },
  typography: {
    xs: scaledPixels(12),
    sm: scaledPixels(14),
    md: scaledPixels(16),
    lg: scaledPixels(18),
    xl: scaledPixels(20),
    xxl: scaledPixels(24),
    xxxl: scaledPixels(28)
  },
  iconSize: {
    small: scaledPixels(16),
    normal: scaledPixels(24),
    large: scaledPixels(32),
    xlarge: scaledPixels(48)
  },
  metrics: {
    headerHeightCompact: scaledPixels(64),
    headerHeightLarge: scaledPixels(88),
    maxContentWidth: scaledPixels(1600),
    tabBarHeight: scaledPixels(56),
    hairline: scaledPixels(1)
  }
};
