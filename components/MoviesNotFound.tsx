import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MoviesNotFound({ text }: { text: string }) {
  return (
    <View style={styles.emptyСontainer}>
      <MaterialIcons name="folder-open" size={120} color="#c5c5c5" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyСontainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#c5c5c5'
  }
});
