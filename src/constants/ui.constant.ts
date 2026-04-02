import { DarkTheme } from '@react-navigation/native';

import { scaledPixels } from '@/hooks/useScaledPixels';
import { CustomTheme } from '@/types/theme.type';

export const BLUR_HASH_MOVIE_CARD: string =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const THEME_COLORS = {
  primary: '#CA563F',
  background: '#0F0F0F',
  surface: '#181818',
  text: '#F1F1F1',
  subtext: '#A9A9A9',
  border: '#2A2A2A',
  focus: '#3EA6FF',
  muted: '#272727'
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
