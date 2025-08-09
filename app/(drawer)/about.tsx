import { scaledPixels } from '@/hooks/useScaledPixels';
import { Image } from 'expo-image';
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
        Додаток, що поєднує в собі віртуальний online кінотеатр і агрегатор відеокодеків. Дає змогу
        швидко знаходити популярні відеофільми, мультфільми, кіношоу, серіали та інший відеоконтент
        у хорошій якості.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaledPixels(6),
    gap: scaledPixels(6)
  },
  text: {
    fontSize: scaledPixels(18),
    fontWeight: 600,
    color: '#fff',
    maxWidth: scaledPixels(400),
    textAlign: 'center'
  }
});
