import MoviesFlatList from '@/components/MoviesFlatList';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { useRouter } from 'expo-router';
import { StyleSheet, TVFocusGuideView } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();

  // const renderHeader = useCallback(
  //   () => (
  //     <View style={styles.header}>
  //       <Image
  //         style={styles.headerImage}
  //         source={{
  //           uri: focusedItem.headerImage
  //         }}
  //         resizeMode="cover"
  //       />
  //       <View style={styles.headerTextContainer}>
  //         <Text style={styles.headerTitle}>{focusedItem.title}</Text>
  //         <Text style={styles.headerDescription}>
  //           {focusedItem.description}
  //         </Text>
  //       </View>
  //     </View>
  //   ),
  //   [
  //     focusedItem.headerImage,
  //     focusedItem.title,
  //     focusedItem.description,
  //     styles.header,
  //     styles.gradientLeft,
  //     styles.gradientBottom
  //   ]
  // );

  return (
    <TVFocusGuideView trapFocusLeft trapFocusDown>
      {/* {renderHeader()} */}
      <MoviesFlatList />
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flex: 1,
    marginBottom: scaledPixels(48)
  },
  highlightsTitle: {
    color: '#fff',
    fontSize: scaledPixels(34),
    fontWeight: 'bold',
    marginBottom: scaledPixels(10),
    marginTop: scaledPixels(15),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10)
  },
  headerTitle: {
    color: '#fff',
    fontSize: scaledPixels(48),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10)
  },
  headerDescription: {
    color: '#fff',
    fontSize: scaledPixels(24),
    fontWeight: '500',
    paddingTop: scaledPixels(16),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10)
  },
  thumbnailTextContainer: {
    position: 'absolute',
    bottom: scaledPixels(10),
    left: scaledPixels(10),
    right: scaledPixels(10),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: scaledPixels(5),
    borderRadius: scaledPixels(3)
  },
  thumbnailText: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: 'bold',
    textAlign: 'center'
  },
  highlightThumbnail: {
    width: scaledPixels(400),
    height: scaledPixels(240),
    marginRight: scaledPixels(10),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scaledPixels(5)
  },
  highlightThumbnailFocused: {
    borderColor: '#fff',
    borderWidth: scaledPixels(4)
  },
  highlightsContainer: {
    padding: scaledPixels(10),
    height: scaledPixels(360)
  },
  thumbnailPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    height: '100%',
    borderRadius: scaledPixels(5)
  },
  header: {
    width: '100%',
    height: scaledPixels(700),
    position: 'relative'
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  gradientLeft: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%'
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '15%'
  },
  headerTextContainer: {
    position: 'absolute',
    left: scaledPixels(40),
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: '50%'
  },
  highlightsList: {
    paddingLeft: scaledPixels(20)
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: scaledPixels(10),
    borderTopRightRadius: scaledPixels(10)
  }
});
