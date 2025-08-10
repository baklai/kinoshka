import MoviesFlatList from '@/components/MoviesFlatList';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/Blurhash';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  useAnimatedValue,
  View
} from 'react-native';

export default function IndexScreen() {
  const [focusedItem, setFocusedItem] = useState<MovieProps | null>(null);
  const fadeAnimated = useAnimatedValue(0);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const renderHeader = useCallback(
    () => (
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnimated }]}>
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.linearGradientBackground}
        />

        <View style={styles.headerContainer}>
          <View style={styles.headerImageContainer}>
            <Image
              style={styles.headerImage}
              source={focusedItem?.poster}
              placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
              contentFit="cover"
              transition={1000}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{focusedItem?.title}</Text>
            <Text style={styles.headerText}>Якість: 1080p</Text>
            <Text style={styles.headerText}>Рік виходу: {focusedItem?.year}</Text>
            <Text style={styles.headerDescription}>{focusedItem?.description}</Text>

            <View style={styles.headerButtonContainer}>
              {/* <PressableButton text="View video" /> */}
              <Button title="View video" onPress={() => Alert.alert('Left button pressed')} />
              <Button title="Favorite" onPress={() => Alert.alert('Right button pressed')} />
            </View>
          </View>
        </View>
      </Animated.View>
    ),
    [focusedItem]
  );

  const hendleSelectItem = (value: MovieProps) => {
    setFocusedItem(value);
    Animated.timing(fadeAnimated, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    const onBackPress = () => {
      if (focusedItem) {
        Animated.timing(fadeAnimated, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }).start(() => {
          setFocusedItem(null);
        });
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      subscription.remove();
    };
  }, [focusedItem]);

  return (
    <>
      {focusedItem && renderHeader()}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: scaledPixels(14) }}
        showsVerticalScrollIndicator={false}
      >
        <MoviesFlatList
          api={apiUrl}
          category="Фільми"
          filters={{ category: 'filmy' }}
          onPress={hendleSelectItem}
        />

        <MoviesFlatList
          api={apiUrl}
          category="Серіали"
          filters={{ category: 'seriesss' }}
          onPress={hendleSelectItem}
        />

        <MoviesFlatList
          api={apiUrl}
          category="Мультфільми"
          filters={{ category: 'cartoon' }}
          onPress={hendleSelectItem}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    padding: scaledPixels(10),
    backgroundColor: 'rgb(39, 39, 41)'
  },
  linearGradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  headerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: scaledPixels(10)
  },
  headerTitle: {
    color: '#fff',
    fontSize: scaledPixels(28),
    fontWeight: 'bold'
  },
  headerTextContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerText: {
    color: '#fff',
    fontSize: scaledPixels(22)
  },
  headerDescription: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: '500',
    paddingTop: scaledPixels(16),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10),
    lineHeight: 22,
    marginTop: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '80%'
  },
  headerImageContainer: {
    width: scaledPixels(400),
    height: scaledPixels(600)
  },
  headerImage: {
    width: '90%',
    height: '90%',
    borderRadius: scaledPixels(8)
  },
  headerButtonContainer: {
    gap: scaledPixels(8),
    flexDirection: 'row',
    paddingVertical: scaledPixels(8)
  }
});
