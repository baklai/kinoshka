import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MovieView(movie: MovieProps) {
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{movie.title}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.posterContainer}>
          <Image
            style={styles.poster}
            source={movie.poster}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Якість: 1080p</Text>
          <Text style={styles.label}>Рік виходу: {movie.year}</Text>
          <Text style={styles.description}>Опис: {movie.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    flexGrow: 1
  },
  header: {
    marginBottom: 8
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap'
  },
  posterContainer: {
    width: 240,
    height: 360,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  info: {
    flex: 1
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '80%'
  }
});
