import { File, Paths } from 'expo-file-system';
import { Image } from 'expo-image';
import * as IntentLauncher from 'expo-intent-launcher';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import { NotFoundView } from '@/components/NotFoundView';
import { StyledIcon } from '@/components/StyledIcon';
import { StyledLoader } from '@/components/StyledLoader';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHistory } from '@/hooks/useHistory';
import { useOrientation } from '@/hooks/useOrientation';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { EpisodeProps, MovieProps } from '@/types/movie.type';
import { sleep } from '@/utils';

const Separator = () => <View style={styles.separator} />;

export default function DetailsScreen() {
  const orientation = useOrientation();
  const { baseUrl, getMovieDetails, getMovieEpisodes } = useAppContext();
  const { source } = useLocalSearchParams<{ source: string }>();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { addToHistory } = useHistory();

  const [movie, setMovie] = useState<MovieProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const bookmarked = useMemo(() => isBookmarked(source ?? ''), [isBookmarked, source]);

  const openPlaylist = async (videos: EpisodeProps[], playlistName: string) => {
    try {
      if (isMountedRef.current) setLoading(true);

      if (videos.length === 0) {
        const episodes = await getMovieEpisodes(baseUrl, source ?? '');
        videos.push(...episodes);
      }

      let m3uContent = '#EXTM3U\n';
      for (const video of videos) {
        m3uContent += `#EXTINF:-1,${video.title}\n${video.source}\n`;
      }

      const safeName = playlistName.replace(/\s+/g, '_');
      const file = new File(Paths.cache, `${safeName}.m3u`);

      if (file.exists) {
        file.delete();
      }

      file.write(m3uContent);

      const contentUri = file.contentUri;

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        type: 'application/vnd.apple.mpegurl',
        flags: 1,
        extra: { 'android.intent.extra.INITIAL_INTENTS': [] }
      });

      ToastAndroid.show(`${playlistName} відкривається`, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error opening playlist:', error);
      ToastAndroid.show(`Не вдалося відкрити ${playlistName}`, ToastAndroid.SHORT);
    } finally {
      await sleep(5000);
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!source) return;

    const fetchMovie = async () => {
      try {
        if (isMountedRef.current) setLoading(true);

        const response = await getMovieDetails(baseUrl, source);

        if (!isMountedRef.current) return;
        setMovie(response);
      } catch (error) {
        if (!isMountedRef.current) return;
        ToastAndroid.show('Помилка завантаження фільму', ToastAndroid.SHORT);
        console.error('Movie loading error:', error);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };

    fetchMovie();
  }, [source]);

  return (
    <View style={styles.flex} hasTVPreferredFocus>
      {loading ? (
        <StyledLoader />
      ) : !movie ? (
        <NotFoundView icon="movie-off-outline" text="Відео не знайдено" />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            orientation === 'landscape' ? styles.scrollLandscape : styles.scrollPortrait
          ]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.asideContainer}>
            <Image
              style={[
                styles.headerImage,
                orientation === 'landscape' && styles.headerImageLandscape,
                orientation === 'portrait' && styles.headerImagePortrait
              ]}
              source={movie.poster}
              placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
              contentFit="cover"
              transition={1000}
            />

            <Pressable
              focusable
              hasTVPreferredFocus
              onPress={async () => {
                if (movie.title) {
                  await addToHistory({
                    source: movie.source,
                    poster: movie.poster ?? null,
                    title: movie.title
                  });
                }
                openPlaylist(movie.episodes ?? [], movie.originalTitle || movie.title || '');
              }}
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
            <View style={styles.titleRow}>
              <View style={styles.titleSpacer} />

              <View style={styles.titleCenter}>
                {movie.title && movie.title.length > 0 && (
                  <Text style={styles.headerTitle}>{movie.title}</Text>
                )}
                {movie.originalTitle && movie.originalTitle.length > 0 && (
                  <Text style={styles.headerOriginalText}>{movie.originalTitle}</Text>
                )}
              </View>

              <Pressable
                focusable
                onPress={() => {
                  if (movie.title) {
                    toggleBookmark({
                      source: movie.source,
                      poster: movie.poster ?? null,
                      title: movie.title
                    });
                  }
                }}
                style={({ focused, pressed }) => [
                  styles.bookmarkButton,
                  focused && { backgroundColor: AppTheme.colors.muted },
                  pressed && { opacity: 0.7 }
                ]}
              >
                <StyledIcon
                  icon="bookmark"
                  size="large"
                  color={bookmarked ? AppTheme.colors.primary : AppTheme.colors.subtext}
                />
              </Pressable>
            </View>

            <View style={styles.flex}>
              {movie.imdb && movie.imdb.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>IMDB:</Text> {movie.imdb}
                </Text>
              )}
              {movie.year && movie.year.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Рік виходу:</Text> {movie.year}
                </Text>
              )}
              {movie.age && movie.age.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Вік. рейтинг:</Text> {movie.age}
                </Text>
              )}
              {movie.duration && movie.duration.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Тривалість:</Text> {movie.duration}
                </Text>
              )}
              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Жанр:</Text> {movie.genres.join(', ')}
                </Text>
              )}
              {Array.isArray(movie.countries) && movie.countries.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Країна:</Text> {movie.countries.join(', ')}
                </Text>
              )}
              {Array.isArray(movie.directors) && movie.directors.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Режисер:</Text> {movie.directors.join(', ')}
                </Text>
              )}
              {Array.isArray(movie.actors) && movie.actors.length > 0 && (
                <Text style={styles.headerText}>
                  <Text style={styles.textBold}>Актори:</Text> {movie.actors.join(', ')}
                </Text>
              )}

              <Separator />

              {movie.description && movie.description.length > 0 && (
                <Text style={styles.headerDescription}>{movie.description}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollContent: {
    gap: scaledPixels(20)
  },
  scrollLandscape: {
    flex: 1,
    flexDirection: 'row'
  },
  scrollPortrait: {
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  asideContainer: {
    justifyContent: 'space-around'
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  titleSpacer: {
    width: scaledPixels(40)
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center'
  },
  bookmarkButton: {
    aspectRatio: 1,
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center'
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
    aspectRatio: 2 / 3,
    borderRadius: scaledPixels(8)
  },
  headerImageLandscape: {
    height: '85%' as any
  },
  headerImagePortrait: {
    width: '100%' as any
  },
  playButton: {
    height: '8%' as any,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.muted,
    borderRadius: scaledPixels(6)
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
