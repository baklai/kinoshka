import ParallaxScrollView from '@/components/ParallaxView';
import { scaledPixels } from '@/hooks/useScaledPixels';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

export default function DetailsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Ionicons size={scaledPixels(310)} name="code-slash" style={styles.headerImage} />
      }
    ></ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: scaledPixels(-90),
    left: scaledPixels(-35),
    position: 'absolute'
  },
  titleContainer: {
    flexDirection: 'row',
    gap: scaledPixels(8)
  }
});
