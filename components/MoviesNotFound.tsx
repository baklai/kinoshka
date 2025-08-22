import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MoviesNotFound({ text, size = 120 }: { text: string; size?: number }) {
  return (
    <View style={styles.emptyСontainer}>
      <StyledIcon name="folder-open" size={size} color={AppTheme.colors.subtext} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyСontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: AppTheme.colors.subtext
  }
});
