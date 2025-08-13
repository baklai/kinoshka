import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MovieCard(
  props: MovieProps & { handlePress?: (item: MovieProps) => void }
) {
  const { poster, title, rating, handlePress } = props;
  const [focused, setFocused] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.container, focused && styles.containerFocused]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={() => handlePress && handlePress(props)}
    >
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={poster}
          placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
          contentFit="cover"
          transition={1000}
        />

        <View style={styles.overlayTop}>
          <View style={styles.rating}>
            <MaterialIcons name="recommend" size={scaledPixels(14)} color="#c5c5c5" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>

          <View style={styles.quality}>
            <Text style={styles.qualityText}>1080p</Text>
          </View>
        </View>

        {focused && (
          <MaterialIcons
            name="play-circle"
            size={scaledPixels(80)}
            color="#ca563f"
            style={styles.playIcon}
            pointerEvents="none"
          />
        )}

        {focused && <View style={styles.overlay} />}
      </View>

      <View style={styles.overlayBottom}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: scaledPixels(11),
    alignItems: 'center',
    borderWidth: scaledPixels(3),
    borderColor: 'transparent',
    margin: scaledPixels(6)
  },
  containerFocused: {
    borderColor: '#ca563f'
  },
  imageWrapper: {
    width: scaledPixels(200),
    height: scaledPixels(300),
    borderRadius: scaledPixels(8),
    overflow: 'hidden',
    position: 'relative'
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E0F'
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    opacity: 0.8,
    marginLeft: -scaledPixels(40),
    marginTop: -scaledPixels(40),
    zIndex: 10
  },
  overlayTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: scaledPixels(8),
    left: scaledPixels(4),
    right: scaledPixels(4),
    zIndex: 10
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
    backgroundColor: '#19875480',
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
    fontSize: scaledPixels(14),
    paddingHorizontal: scaledPixels(3)
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
    fontSize: scaledPixels(14)
  },
  title: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
});
