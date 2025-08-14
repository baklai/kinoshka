import { COLORS, ICON_SIZE } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React from 'react';
import { type OpaqueColorValue, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type StyledIconSize = keyof typeof ICON_SIZE;

export type StyledIconProps = {
  size?: StyledIconSize;
  color?: string | OpaqueColorValue;
};

export const NewsSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z"
        />
      </Svg>
    </View>
  );
};

export const MoviesSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M18,9H16V7H18M18,13H16V11H18M18,17H16V15H18M8,9H6V7H8M8,13H6V11H8M8,17H6V15H8M18,3V5H16V3H8V5H6V3H4V21H6V19H8V21H16V19H18V21H20V3H18Z"
        />
      </Svg>
    </View>
  );
};

export const SeriesSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M10,15H8V13H10V15M10,11H8V9H10V11M10,7H8V5H10V7M20,15H18V13H20V15M20,11H18V9H20V11M20,7H18V5H20V7Z"
        />
      </Svg>
    </View>
  );
};

export const CartoonsSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M5.5,2C3.56,2 2,3.56 2,5.5V18.5C2,20.44 3.56,22 5.5,22H16L22,16V5.5C22,3.56 20.44,2 18.5,2H5.5M5.75,4H18.25A1.75,1.75 0 0,1 20,5.75V15H18.5C16.56,15 15,16.56 15,18.5V20H5.75A1.75,1.75 0 0,1 4,18.25V5.75A1.75,1.75 0 0,1 5.75,4M14.44,6.77C14.28,6.77 14.12,6.79 13.97,6.83C13.03,7.09 12.5,8.05 12.74,9C12.79,9.15 12.86,9.3 12.95,9.44L16.18,8.56C16.18,8.39 16.16,8.22 16.12,8.05C15.91,7.3 15.22,6.77 14.44,6.77M8.17,8.5C8,8.5 7.85,8.5 7.7,8.55C6.77,8.81 6.22,9.77 6.47,10.7C6.5,10.86 6.59,11 6.68,11.16L9.91,10.28C9.91,10.11 9.89,9.94 9.85,9.78C9.64,9 8.95,8.5 8.17,8.5M16.72,11.26L7.59,13.77C8.91,15.3 11,15.94 12.95,15.41C14.9,14.87 16.36,13.25 16.72,11.26Z"
        />
      </Svg>
    </View>
  );
};

export const TVShowsSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M8.16,3L6.75,4.41L9.34,7H4C2.89,7 2,7.89 2,9V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V9C22,7.89 21.11,7 20,7H14.66L17.25,4.41L15.84,3L12,6.84L8.16,3M4,9H17V19H4V9M19.5,9A1,1 0 0,1 20.5,10A1,1 0 0,1 19.5,11A1,1 0 0,1 18.5,10A1,1 0 0,1 19.5,9M19.5,12A1,1 0 0,1 20.5,13A1,1 0 0,1 19.5,14A1,1 0 0,1 18.5,13A1,1 0 0,1 19.5,12Z"
        />
      </Svg>
    </View>
  );
};

export const HistorySvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"
        />
      </Svg>
    </View>
  );
};

export const BookmarkSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path fill={color} d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />
      </Svg>
    </View>
  );
};

export const OptionsSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
        />
      </Svg>
    </View>
  );
};

export const AboutSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
        />
      </Svg>
    </View>
  );
};

export const ExitSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M19,3H5C3.89,3 3,3.89 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10.08,15.58L11.5,17L16.5,12L11.5,7L10.08,8.41L12.67,11H3V13H12.67L10.08,15.58Z"
        />
      </Svg>
    </View>
  );
};

export const SearchSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
        />
      </Svg>
    </View>
  );
};

export const SortSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z"
        />
      </Svg>
    </View>
  );
};

export const DotsVerticalSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"
        />
      </Svg>
    </View>
  );
};

export const MultimediaSvgIcon = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return (
    <View style={styles.container} {...props}>
      <Svg
        height={scaledPixels(ICON_SIZE[size])}
        width={scaledPixels(ICON_SIZE[size])}
        viewBox="0 0 24 24"
      >
        <Path
          fill={color}
          d="M9 13V5C9 3.9 9.9 3 11 3H20C21.1 3 22 3.9 22 5V11H18.57L17.29 9.26C17.23 9.17 17.11 9.17 17.05 9.26L15.06 12C15 12.06 14.88 12.07 14.82 12L13.39 10.25C13.33 10.18 13.22 10.18 13.16 10.25L11.05 12.91C10.97 13 11.04 13.15 11.16 13.15H17.5V15H11C9.89 15 9 14.11 9 13M6 22V21H4V22H2V2H4V3H6V2H8.39C7.54 2.74 7 3.8 7 5V13C7 15.21 8.79 17 11 17H15.7C14.67 17.83 14 19.08 14 20.5C14 21.03 14.11 21.53 14.28 22H6M4 7H6V5H4V7M4 11H6V9H4V11M4 15H6V13H4V15M6 19V17H4V19H6M23 13V15H21V20.5C21 21.88 19.88 23 18.5 23S16 21.88 16 20.5 17.12 18 18.5 18C18.86 18 19.19 18.07 19.5 18.21V13H23Z"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
