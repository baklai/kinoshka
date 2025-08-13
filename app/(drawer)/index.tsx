import DropdownButton from '@/components/DropdownButton';
import MoviesFlatList from '@/components/MoviesFlatList';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Drawer } from 'expo-router/drawer';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View
} from 'react-native';

export default function IndexScreen() {
  const [focusedItem, setFocusedItem] = useState<MovieProps | null>(null);
  const fadeAnimated = useAnimatedValue(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handlePlay = (episode?: string) => {
    Alert.alert('Проигрывание', episode ? `Серия: ${episode}` : 'Фильм');
  };

  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
  };

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
            {focusedItem?.title && <Text style={styles.headerTitle}>{focusedItem.title}</Text>}
            {focusedItem?.originalTitle && (
              <Text style={styles.headerText}>Оригінальна назва: {focusedItem.originalTitle}</Text>
            )}
            {focusedItem?.quality && (
              <Text style={styles.headerText}>Якість: {focusedItem.quality}</Text>
            )}
            {focusedItem?.rating && (
              <Text style={styles.headerText}>Рейтинг: {focusedItem.rating}</Text>
            )}
            {focusedItem?.year && (
              <Text style={styles.headerText}>Рік виходу: {focusedItem.year}</Text>
            )}
            {focusedItem?.country && (
              <Text style={styles.headerText}>Країна: {focusedItem.country}</Text>
            )}
            {focusedItem?.genres && (
              <Text style={styles.headerText}>Жанри: {focusedItem.genres}</Text>
            )}
            {focusedItem?.directors?.length ? (
              <Text style={styles.headerText}>Режисер: {focusedItem.directors.join(', ')}</Text>
            ) : null}
            {focusedItem?.actors?.length ? (
              <Text style={styles.headerText}>Актори: {focusedItem.actors.join(', ')}</Text>
            ) : null}
            {focusedItem?.description && (
              <Text style={styles.headerDescription}>{focusedItem.description}</Text>
            )}

            <View style={styles.headerButtonContainer}>
              <DropdownButton episodes={focusedItem?.episode} onPlay={handlePlay} />
              <TouchableOpacity
                style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]}
                onPress={handleBookmark}
              >
                {/* <StyledIcon
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  color={isBookmarked ? '#00ff55ff' : '#fff'}
                /> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    ),
    [focusedItem, fadeAnimated, isBookmarked]
  );

  const handleSelectItem = (value: MovieProps) => {
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
        }).start(() => setFocusedItem(null));
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [focusedItem]);

  return (
    <>
      <Drawer.Screen
        options={{
          headerTitle: () => (
            <View style={styles.header}>
              {/* <NewSvgIcon /> */}
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                Поточна категорія
              </Text>
            </View>
          )
        }}
      />

      {focusedItem && renderHeader()}

      <MoviesFlatList
        api={apiUrl}
        category={'filmy'}
        filters={{ category: 'filmy' }}
        onPress={handleSelectItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(6)
  },
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
    flexDirection: 'row',
    padding: scaledPixels(10)
  },
  headerTitle: {
    color: '#fff',
    fontSize: scaledPixels(28),
    fontWeight: 'bold'
  },
  headerTextContainer: {
    flexDirection: 'column',
    flexShrink: 1
  },
  headerText: {
    color: '#fff',
    fontSize: scaledPixels(20)
  },
  headerDescription: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: '500',
    paddingTop: scaledPixels(10),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10),
    lineHeight: 22,
    marginTop: 6,
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
  },
  bookmarkButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: scaledPixels(8),
    borderRadius: scaledPixels(6)
  },
  bookmarkButtonActive: {
    backgroundColor: 'rgba(255,215,0,0.2)'
  }
});
