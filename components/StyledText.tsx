import { AppTheme } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

type StyledTextProps = TextProps & {
  variant?: 'title' | 'body' | 'caption';
};

const StyledText: React.FC<StyledTextProps> = ({ style, variant = 'body', ...props }) => {
  return <Text style={[styles.base, styles[variant], style]} {...props} />;
};

const styles = StyleSheet.create({
  base: {
    color: AppTheme.colors.text
  },
  title: {
    fontSize: scaledPixels(24),
    fontWeight: 'bold'
  },
  body: {
    fontSize: scaledPixels(16)
  },
  caption: {
    fontSize: scaledPixels(12),
    opacity: 0.8
  }
});

export default StyledText;
