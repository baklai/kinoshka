import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          headerTitle: () => (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                Ой! Цього екрана не існує.
              </Text>
            </View>
          )
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Цього екрана не існує.</Text>
        <Link href="/" style={styles.link}>
          <Text>Перейдіть на головний екран!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 600
  },
  link: {
    color: '#fff',
    paddingVertical: 15
  }
});
