import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { ColorType } from '@/types/colors.type';
import { IconType } from '@/types/icons.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { type ViewStyle, StyleSheet, View } from 'react-native';

const ICON_SIZE = {
  small: 16,
  normal: 24,
  large: 32,
  xlarge: 48
} as const;

type StyledIconSize = keyof typeof ICON_SIZE;

type StyledIconProps = {
  icon?: IconType;
  size?: StyledIconSize | number;
  color?: ColorType;
  style?: ViewStyle;
};

export const StyledIcon = ({
  icon,
  size = 'normal' as StyledIconSize,
  color = AppTheme.colors.text,
  style
}: StyledIconProps) => {
  const resolvedSize =
    typeof size === 'number' ? scaledPixels(size) : scaledPixels(ICON_SIZE[size]);

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name={icon} color={color} size={resolvedSize} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
