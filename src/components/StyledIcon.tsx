import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { AppTheme } from '@/constants/ui.constant';
import { ColorType } from '@/types/colors.type';
import { IconType } from '@/types/icons.type';

type StyledIconSize = keyof typeof AppTheme.iconSize;

type StyledIconProps = {
  icon?: IconType;
  size?: StyledIconSize | number;
  color?: ColorType;
  style?: ViewStyle;
};

export const StyledIcon = ({
  icon,
  size = 'normal',
  color = AppTheme.colors.text,
  style
}: StyledIconProps) => {
  const resolvedSize = typeof size === 'number' ? size : AppTheme.iconSize[size];

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
