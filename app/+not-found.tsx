import { scaledPixels } from '@/hooks/useScaledPixels';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Цього екрана не існує.</Text>
      <Link href="/" style={styles.link}>
        <Text>Перейдіть на головний екран!</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaledPixels(20)
  },
  text: {
    color: '#fff',
    fontSize: scaledPixels(24),
    fontWeight: 600
  },
  link: {
    color: '#fff',
    marginTop: scaledPixels(15),
    paddingVertical: scaledPixels(15)
  }
});
