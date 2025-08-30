import AnimatedLoader from '@/components/AnimatedLoader';
import NotFoundView from '@/components/NotFoundView';
import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { EpisodeProps, MovieProps } from '@/types/movie.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useMemo, useState } from 'react';
import {
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
  const { width, height } = useWindowDimensions();
  const { baseUrl, getMovieDetails } = useAppContext();
  const { source } = useLocalSearchParams<{ source: string }>();
  const [movie, setMovie] = useState<any | null>(null);
  const [bookmarks, setBookmarks] = useState<MovieProps[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const orientation = useMemo<'portrait' | 'landscape'>(() => {
    return height >= width ? 'portrait' : 'landscape';
  }, [width, height]);

  const toggleBookmark = async () => {
    const isBookmarkCkech = bookmarks.some((bookmark: MovieProps) => bookmark.source === source);

    setIsBookmarked(isBookmarkCkech);

    const updatedBookmarks = isBookmarkCkech
      ? bookmarks.filter((bookmark: MovieProps) => bookmark.source !== source)
      : [...bookmarks, movie];

    setBookmarks(updatedBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const openPlaylistInVLC = async (videos: EpisodeProps[], playlistName: string) => {
    try {
      let m3uContent = '#EXTM3U\n';
      for (const video of videos) {
        m3uContent += `#EXTINF:-1,${video.title}\n${video.source}\n`;
      }

      const cacheDir = FileSystem.cacheDirectory!;
      const files = await FileSystem.readDirectoryAsync(cacheDir);
      for (const file of files) {
        if (file.endsWith('.m3u8')) {
          await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
        }
      }

      const fileUri = `${cacheDir}${playlistName.replace(/\s+/g, '_')}.m3u8`;
      await FileSystem.writeAsStringAsync(fileUri, m3uContent, {
        encoding: FileSystem.EncodingType.UTF8
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/x-mpegURL' });
      } else {
        ToastAndroid.show('Sharing не підтримується на цьому пристрої', ToastAndroid.SHORT);
      }

      const historyRaw = await AsyncStorage.getItem('history');
      const history: string[] = historyRaw ? JSON.parse(historyRaw) : [];
      let updated = false;
      for (const video of videos) {
        if (!history.includes(video.source)) {
          history.push(video.source);
          updated = true;
        }
      }
      if (updated) {
        await AsyncStorage.setItem('history', JSON.stringify(history));
      }
    } catch (e) {
      console.error(e);
      ToastAndroid.show('Не вдалося відкрити плейлист', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);

        if (source) {
          const response = await getMovieDetails(baseUrl, source);

          const bookmarks = await AsyncStorage.getItem('bookmarks');
          if (bookmarks) {
            setBookmarks([...JSON.parse(bookmarks)]);
          }
          setMovie(response);
        }
      } catch (error) {
        ToastAndroid.show('Помилка завантаження фільму', ToastAndroid.SHORT);
        console.error('Movie loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [source]);

  return (
    <>
      {loading ? (
        <AnimatedLoader />
      ) : !movie ? (
        <NotFoundView icon="movie-off-outline" text="Відео не знайдено" />
      ) : (
        <View
          style={[styles.container, orientation === 'portrait' && { flexDirection: 'column' }]}
          hasTVPreferredFocus
        >
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
                  onPress={() =>
                    openPlaylistInVLC(movie?.episodes, movie.originalTitle || movie.title)
                  }
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
                    color={isBookmarked ? 'green' : AppTheme.colors.text}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.textContainer}>
            {movie?.title && movie?.title?.length > 0 && (
              <Text style={styles.headerTitle}>{movie.title}</Text>
            )}

            {movie?.originalTitle && movie?.originalTitle?.length > 0 && (
              <Text style={styles.headerOriginalText}>{movie.originalTitle}</Text>
            )}

            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
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
            </ScrollView>
          </View>
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
