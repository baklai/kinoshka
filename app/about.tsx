import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/adaptive-icon.png')}
        style={{ width: 200, height: 200 }}
        contentFit="cover"
      />

      <Text style={styles.text}>
        Додаток надає можливість швидко знаходити, на публічних ресурсах, популярні відеофільми,
        мультфільми, кіношоу, серіали та інший відеоконтент у хорошій якості. Все відео в додатку
        програвається з відкритих ресурсів. Автори додатку не несуть відповідальності за данні
        ролики, ніяк не пов'язані з розміщенням та розповсюдженням відеоматеріалів.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10)
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledPixels(6),
    gap: scaledPixels(6)
  },
  text: {
    fontSize: scaledPixels(18),
    fontWeight: 600,
    color: AppTheme.colors.text,
    maxWidth: scaledPixels(500),
    textAlign: 'center'
  }
});
