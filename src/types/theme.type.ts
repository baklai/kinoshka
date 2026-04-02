import { Theme } from '@react-navigation/native';

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
