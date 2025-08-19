import { Stack } from 'expo-router';
import React from 'react';

export default function OptionsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Настройки' }} />
      <Stack.Screen name="catalog" options={{ title: 'Детали' }} />
      <Stack.Screen name="video" options={{ title: 'Детали' }} />
    </Stack>
  );
}
