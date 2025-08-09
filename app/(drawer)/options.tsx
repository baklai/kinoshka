import ParallaxView from '@/components/ParallaxView';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function OptionsScreen() {
  return (
    <ParallaxView
      headerBackgroundColor={{ light: '#217FC9', dark: '#217FC9' }}
      headerImage={
        <MaterialIcons size={scaledPixels(140)} name="settings" style={styles.headerImage} />
      }
    ></ParallaxView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#042E5C',
    bottom: scaledPixels(-10),
    left: scaledPixels(-10),
    position: 'absolute'
  },
  titleContainer: {
    flexDirection: 'row',
    gap: scaledPixels(8)
  }
});
