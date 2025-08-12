import StyledIcon from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Image } from 'expo-image';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <>
      <Drawer.Screen
        options={{
          headerRight: () => null,
          headerTitle: () => (
            <View style={styles.header}>
              <StyledIcon name="information-outline" />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Про додаток</Text>
            </View>
          )
        }}
      />

      <View style={styles.container}>
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={{ width: 200, height: 200 }}
          contentFit="cover"
        />

        <Text style={styles.text}>
          Додаток, що поєднує в собі віртуальний online кінотеатр і агрегатор відеокодеків. Дає
          змогу швидко знаходити популярні відеофільми, мультфільми, кіношоу, серіали та інший
          відеоконтент у хорошій якості.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(6)
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
    color: '#fff',
    maxWidth: scaledPixels(400),
    textAlign: 'center'
  }
});
