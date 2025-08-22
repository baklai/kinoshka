import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { type ComponentProps } from 'react';
import { type OpaqueColorValue, type ViewStyle, StyleSheet, View } from 'react-native';

const ICON_SIZE = {
  small: 16,
  normal: 24,
  large: 32,
  xlarge: 48
} as const;

type StyledIconSize = keyof typeof ICON_SIZE;

type StyledIconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'size' | 'color'> & {
  size?: number | StyledIconSize;
  color?: string | OpaqueColorValue;
  style?: ViewStyle;
};

export const StyledIcon = ({
  size = 'normal' as StyledIconSize,
  color = AppTheme.colors.text,
  style,
  ...props
}: StyledIconProps) => {
  const resolvedSize =
    typeof size === 'number' ? scaledPixels(size) : scaledPixels(ICON_SIZE[size]);

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons color={color} size={resolvedSize} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
