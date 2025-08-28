import AnimatedLoader from '@/components/AnimatedLoader';
import NotFoundView from '@/components/NotFoundView';
import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View
} from 'react-native';

const Separator = () => <View style={styles.separator} />;

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useWindowDimensions();
  const { loading, error, fetch } = useAsyncFetch('movies');
  const [movie, setMovie] = useState<MovieProps | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const orientation = useMemo<'portrait' | 'landscape'>(() => {
    return height >= width ? 'portrait' : 'landscape';
  }, [width, height]);

  const toggleBookmark = async () => {
    const isBookmarked = bookmarks.includes(id);
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter(bookmark => bookmark !== id)
      : [...bookmarks, id];

    setBookmarks(updatedBookmarks);
    await SecureStore.setItemAsync('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const openInVLC = async (url: string) => {
    const vlcUrl = `vlc://${url}`;
    const supported = await Linking.canOpenURL(vlcUrl);
    if (supported) {
      await Linking.openURL(vlcUrl);
      const history = await SecureStore.getItemAsync('history');
      const updatedHistory = history ? new Set([...JSON.parse(history), id]) : [id];
      await SecureStore.setItemAsync('history', JSON.stringify(updatedHistory));
    } else {
      ToastAndroid.show('VLC не встановлено або схема не підтримується', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const response = await fetch(id, {});

          const bookmarks = await SecureStore.getItemAsync('bookmarks');

          if (bookmarks) {
            setBookmarks([...JSON.parse(bookmarks)]);
          }

          setMovie(response);
        }
      } catch (error) {
        ToastAndroid.show('Помилка завантаження фільму', ToastAndroid.SHORT);
        console.error('Movie loading error:', error);
      }
    };

    fetchMovie();
  }, [id]);

  return (
    <>
      {loading ? (
        <AnimatedLoader />
      ) : error ? (
        <NotFoundView icon="movie-off-outline" text="Відео не знайдено" />
      ) : (
        <View style={[styles.container, orientation === 'portrait' && { flexDirection: 'column' }]}>
          <View
            style={[
              styles.asideContainer,
              { width: orientation === 'portrait' ? width : scaledPixels(400) }
            ]}
          >
            <Image
              style={styles.headerImage}
              source={movie?.poster}
              placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
              contentFit="cover"
              transition={1000}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              {Array.isArray(movie?.episodes) && movie.episodes.length > 0 && (
                <Pressable
                  focusable
                  hasTVPreferredFocus
                  onPress={() => openInVLC(movie?.episodes?.[0]?.source || '')}
                  style={({ focused, pressed }) => [
                    styles.playButton,
                    { width: '80%', justifyContent: 'center' },
                    focused && { backgroundColor: AppTheme.colors.primary },
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <View style={styles.playButtonContent}>
                    <StyledIcon icon="play-circle-outline" />
                    <Text style={styles.playButtonText}>Дивитись відео</Text>
                  </View>
                </Pressable>
              )}

              <Pressable
                focusable
                onPress={toggleBookmark}
                style={({ focused, pressed }) => [
                  {
                    backgroundColor: AppTheme.colors.muted,
                    borderRadius: scaledPixels(6),
                    paddingHorizontal: scaledPixels(12),
                    justifyContent: 'center'
                  },

                  focused && {
                    backgroundColor: AppTheme.colors.primary
                  },
                  pressed && { opacity: 0.7 }
                ]}
              >
                <View style={styles.playButtonContent}>
                  <StyledIcon
                    icon="bookmark"
                    color={bookmarks.includes(id) ? 'green' : AppTheme.colors.text}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.textContainer}>
              {movie?.title && movie?.title?.length > 0 && (
                <Text style={styles.headerTitle}>{movie.title}</Text>
              )}

              {movie?.originalTitle && movie?.originalTitle?.length > 0 && (
                <Text style={styles.headerOriginalText}>{movie.originalTitle}</Text>
              )}

              {movie?.imdb && movie?.imdb?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>IMDB:</Text> {movie.imdb}
                </Text>
              )}

              {movie?.year && movie?.year?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Рік виходу:</Text> {movie.year}
                </Text>
              )}

              {movie?.age && movie?.age?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Вік. рейтинг:</Text> {movie.age}
                </Text>
              )}

              {movie?.duration && movie?.duration?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Тривалість:</Text> {movie.duration}
                </Text>
              )}

              {Array.isArray(movie?.genres) && movie?.genres?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Жанр:</Text> {movie.genres.join(', ')}
                </Text>
              )}

              {Array.isArray(movie?.countries) && movie?.countries?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Країна:</Text> {movie.countries.join(', ')}
                </Text>
              )}

              {Array.isArray(movie?.directors) && movie?.directors?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Режисер:</Text> {movie.directors.join(', ')}
                </Text>
              )}

              {Array.isArray(movie?.actors) && movie?.actors?.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Актори:</Text> {movie.actors.join(', ')}
                </Text>
              )}

              <Separator />

              {movie?.description && movie?.description?.length > 0 && (
                <Text style={styles.headerDescription}>{movie.description}</Text>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scaledPixels(20),
    flexDirection: 'row'
  },
  asideContainer: {
    alignItems: 'center',
    gap: scaledPixels(15),
    maxWidth: scaledPixels(181 * 2)
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1
  },
  headerTitle: {
    color: AppTheme.colors.text,
    textAlign: 'center',
    fontSize: scaledPixels(28),
    fontWeight: 'bold'
  },
  headerOriginalText: {
    color: AppTheme.colors.subtext,
    textAlign: 'center',
    fontSize: scaledPixels(18)
  },
  headerText: {
    color: AppTheme.colors.text,
    fontSize: scaledPixels(18)
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: scaledPixels(20)
  },
  headerDescription: {
    color: AppTheme.colors.subtext,
    fontSize: scaledPixels(16),
    fontWeight: '500',
    lineHeight: 22,
    flexWrap: 'wrap'
  },
  headerImage: {
    width: '100%',
    height: '80%',
    borderRadius: scaledPixels(8)
  },
  headerButtonContainer: {
    flexDirection: 'row',
    marginVertical: scaledPixels(12)
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.muted,
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(6)
  },
  playButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playButtonText: {
    color: AppTheme.colors.text,
    fontWeight: 'bold',
    marginLeft: scaledPixels(6)
  },
  separator: {
    height: scaledPixels(1),
    marginVertical: scaledPixels(8),
    backgroundColor: AppTheme.colors.border
  }
});
