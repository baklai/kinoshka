import { StyledIcon } from '@/components/StyledIcon';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MoviesNotFound({ text }: { text: string }) {
  return (
    <View style={styles.emptyСontainer}>
      <StyledIcon name="folder-open" size="xlarge" color="#c5c5c5" />
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
    color: '#c5c5c5'
  }
});
