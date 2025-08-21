import { scaledPixels } from '@/hooks/useScaledPixels';
import { DarkTheme, Theme } from '@react-navigation/native';

export const BLUR_HASH_MOVIE_CARD: string =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const Palette = {
  primary: '#CA563F',
  bg: '#0F0F0F',
  surface: '#181818',
  surfaceAlt: '#202020',
  text: '#F1F1F1',
  subtext: '#A9A9A9',
  border: '#2A2A2A',
  focus: '#3EA6FF',
  muted: '#272727'
};

export type CustomTheme = Theme & {
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
    primary: Palette.primary,
    background: Palette.bg,
    card: Palette.surface,
    text: Palette.text,
    border: Palette.border,
    notification: Palette.primary
  },
  spacing: (x: number) => scaledPixels(8 * x),
  radius: { sm: scaledPixels(6), md: scaledPixels(10), lg: scaledPixels(14), xl: scaledPixels(22) },
  metrics: {
    headerHeightCompact: scaledPixels(64),
    headerHeightLarge: scaledPixels(88),
    maxContentWidth: scaledPixels(1600)
  }
};
