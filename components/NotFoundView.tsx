import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { ColorType } from '@/types/colors.type';
import { IconType } from '@/types/icons.type';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type NotFoundProps = {
  icon?: IconType;
  size?: number;
  text?: string;
  color?: ColorType;
  style?: ViewStyle;
};

const NotFoundView = ({
  icon,
  text,
  color = AppTheme.colors.subtext,
  size = 120,
  style = {}
}: NotFoundProps) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <StyledIcon icon={icon} size={size} color={color} />}
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: AppTheme.colors.subtext
  }
});

export default NotFoundView;
