import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import * as Application from 'expo-application';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const currentVersion = useMemo(() => {
    return Application.nativeApplicationVersion || '0.0.0';
  }, [Application]);

  return (
    <View style={styles.container} hasTVPreferredFocus>
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

      <Text style={styles.text}>Поточна версія v{currentVersion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scaledPixels(6)
  },
  text: {
    fontSize: scaledPixels(18),
    color: AppTheme.colors.subtext,
    maxWidth: scaledPixels(560),
    textAlign: 'center'
  }
});
