import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Video from 'react-native-video';

export default function PlayerScreen() {
  const { url } = useLocalSearchParams();

  if (!url) return null;

  const uri = Array.isArray(url) ? url[0] : url;

  return (
    <View style={styles.container}>
      <Video source={{ uri }} controls={true} style={styles.video} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  video: {
    flex: 1
  }
});
