import NotFoundView from '@/components/NotFoundView';
import { StyledIcon } from '@/components/StyledIcon';
import { StyledLoader } from '@/components/StyledLoader';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { sleep } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as IntentLauncher from 'expo-intent-launcher';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

const Separator = () => <View style={styles.separator} />;

export default function DetailsScreen() {
  const { baseUrl, getMovieDetails, getMovieEpisodes } = useAppContext();
  const { source } = useLocalSearchParams<{ source: string }>();
  const [movie, setMovie] = useState<any | null>(null);
  const [bookmarks, setBookmarks] = useState<MovieProps[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleBookmark = async () => {
    const isBookmarkCkech = bookmarks.some((bookmark: MovieProps) => bookmark.source === source);

    setIsBookmarked(isBookmarkCkech);

    const updatedBookmarks = isBookmarkCkech
      ? bookmarks.filter((bookmark: MovieProps) => bookmark.source !== source)
      : [...bookmarks, movie];

    setBookmarks(updatedBookmarks);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  const openPlaylist = async (videos: EpisodeProps[], playlistName: string) => {
    try {
      setLoading(true);

      if (videos?.length === 0) {
        const episodes = await getMovieEpisodes(baseUrl, source);

        videos.push(...episodes);
      }

      let m3uContent = '#EXTM3U\n';
      for (const video of videos) {
        m3uContent += `#EXTINF:-1,${video.title}\n${video.source}\n`;
      }

      const cacheDir = FileSystem.cacheDirectory!;
      const fileUri = `${cacheDir}${playlistName.replace(/\s+/g, '_')}.m3u`;
      await FileSystem.writeAsStringAsync(fileUri, m3uContent, {
        encoding: FileSystem.EncodingType.UTF8
      });

      const contentUri = await FileSystem.getContentUriAsync(fileUri);

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        type: 'application/vnd.apple.mpegurl',
        flags: 1,
        extra: {
          'android.intent.extra.INITIAL_INTENTS': []
        }
      });

      ToastAndroid.show(`${playlistName} відкрито`, ToastAndroid.SHORT);

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
    } catch (error) {
      console.error('Error opening:', error);
      ToastAndroid.show(`Не вдалося відкрити ${playlistName}`, ToastAndroid.SHORT);
    } finally {
      await sleep(3000);
      setLoading(false);
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
  }, []);

  return (
    <View style={{ flex: 1 }} hasTVPreferredFocus>
      {loading ? (
        <StyledLoader />
      ) : !movie ? (
        <NotFoundView icon="movie-off-outline" text="Відео не знайдено" />
      ) : (
        <View style={styles.container}>
          <View style={styles.asideContainer}>
            <Image
              style={styles.headerImage}
              source={movie?.poster}
              placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
              contentFit="cover"
              transition={1000}
            />

            <Pressable
              focusable
              hasTVPreferredFocus
              onPress={() => openPlaylist(movie?.episodes, movie.originalTitle || movie.title)}
              style={({ focused, pressed }) => [
                styles.playButton,
                focused && { backgroundColor: AppTheme.colors.primary },
                pressed && { opacity: 0.7 }
              ]}
            >
              <StyledIcon icon="play-circle-outline" />
              <Text style={styles.playButtonText}>Дивитись відео</Text>
            </Pressable>
          </View>

          <View style={styles.textContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View style={{ width: scaledPixels(40) }} />

              <View style={{ flex: 1, alignItems: 'center' }}>
                {movie?.title?.length > 0 && <Text style={styles.headerTitle}>{movie.title}</Text>}
                {movie?.originalTitle?.length > 0 && (
                  <Text style={styles.headerOriginalText}>{movie.originalTitle}</Text>
                )}
              </View>

              <Pressable
                focusable
                onPress={toggleBookmark}
                style={({ focused, pressed }) => [
                  {
                    aspectRatio: 1,
                    width: scaledPixels(48),
                    height: scaledPixels(48),
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  focused && { backgroundColor: AppTheme.colors.muted },
                  pressed && { opacity: 0.7 }
                ]}
              >
                <StyledIcon
                  icon="bookmark"
                  size="large"
                  color={isBookmarked ? AppTheme.colors.primary : AppTheme.colors.subtext}
                />
              </Pressable>
            </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: scaledPixels(20),
    flexDirection: 'row'
  },
  asideContainer: {
    justifyContent: 'space-around'
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
    height: '85%',
    aspectRatio: 2 / 3,
    borderRadius: scaledPixels(8)
  },
  headerButtonContainer: {
    flexDirection: 'row',
    marginVertical: scaledPixels(12)
  },
  playButton: {
    height: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.muted,
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
