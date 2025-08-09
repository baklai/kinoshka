import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MovieCard({ id, poster, title, rating }: MovieProps) {
  const openLink = (id: string) => {};

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => openLink(id)} style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={poster}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />

        <View style={styles.overlayTop}>
          <View style={styles.rating}>
            <MaterialIcons
              name="recommend"
              size={scaledPixels(14)}
              color="#c5c5c5"
              style={styles.icon}
            />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>

          <View style={styles.quality}>
            <Text style={styles.qualityText}>1080p</Text>
          </View>
        </View>
      </View>
      <View style={styles.overlayBottom}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: scaledPixels(10),
    alignItems: 'center'
  },
  imageWrapper: {
    width: scaledPixels(240),
    height: scaledPixels(360),
    borderRadius: scaledPixels(3),
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0553'
  },
  icon: {},
  overlayTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: scaledPixels(8),
    left: scaledPixels(4),
    right: scaledPixels(4)
  },
  overlayBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#33333370',
    borderBottomLeftRadius: scaledPixels(3),
    borderBottomRightRadius: scaledPixels(3),
    paddingVertical: scaledPixels(4),
    bottom: 0,
    left: 0,
    right: 0
  },
  rating: {
    backgroundColor: '#19875470',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaledPixels(4),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
    marginBottom: scaledPixels(4),
    gap: scaledPixels(2)
  },
  ratingText: {
    color: '#fff',
    fontSize: scaledPixels(12)
  },
  quality: {
    backgroundColor: '#00000070',
    alignSelf: 'flex-start',
    paddingHorizontal: scaledPixels(6),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
    marginBottom: scaledPixels(4)
  },
  qualityText: {
    color: '#fff',
    fontSize: scaledPixels(12)
  },
  title: {
    color: '#fff',
    fontSize: scaledPixels(14),
    fontWeight: '600',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  }
});
