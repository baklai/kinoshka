import { COLORS } from '@/constants/ui.constant';
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
    color: COLORS.PRIMARY_TEXT
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  body: {
    fontSize: 16
  },
  caption: {
    fontSize: 12,
    opacity: 0.8
  }
});

export default StyledText;
