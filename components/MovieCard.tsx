import { MovieProps } from '@/types/movie.type';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MovieCard({ id, poster, title, imdb, width }: MovieProps) {
  const openLink = (id: string) => {
    router.push({
      pathname: '/movie',
      params: { id }
    });
  };

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <TouchableOpacity onPress={() => openLink(id)} style={styles.container} focusable={true}>
      <View style={[styles.imageWrapper, { width, height: 220 }]}>
        <Image
          style={styles.image}
          source={poster}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />

        <View style={styles.overlayTop}>
          <View style={styles.rating}>
            <MaterialIcons name="recommend" size={14} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.ratingText}>{imdb}</Text>
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
    borderRadius: 10,
    alignItems: 'center'
  },
  imageWrapper: {
    width: 240,
    height: 360,
    borderRadius: 3,
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
    top: 8,
    left: 4,
    right: 4
  },
  overlayBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#33333370',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    paddingVertical: 4,
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
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
    gap: 2
  },
  ratingText: {
    color: '#fff',
    fontSize: 12
  },
  quality: {
    backgroundColor: '#00000070',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4
  },
  qualityText: {
    color: '#fff',
    fontSize: 12
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  }
});
