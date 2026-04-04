import { File, Paths } from 'expo-file-system';
import { Image } from 'expo-image';
import * as IntentLauncher from 'expo-intent-launcher';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View
} from 'react-native';

import { NotFoundView } from '@/components/NotFoundView';
import { StyledIcon } from '@/components/StyledIcon';
import { StyledLoader } from '@/components/StyledLoader';
import { PLAYERS } from '@/constants/players.constant';
import { AppTheme, BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useHistory } from '@/hooks/useHistory';
import { useOrientation } from '@/hooks/useOrientation';
import { SERVICES } from '@/services';
import { EpisodeProps, MovieProps } from '@/types/movie.type';

const Separator = () => <View style={styles.separator} />;

export default function DetailsScreen() {
  const orientation = useOrientation();
  const { service, player } = useAppContext();
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

  useEffect(() => {
    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active' && isMountedRef.current) {
        setLoading(false);
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, []);

  const bookmarked = useMemo(() => isBookmarked(source ?? ''), [isBookmarked, source]);

  const openPlaylist = async (videos: EpisodeProps[], playlistName: string) => {
    try {
      if (isMountedRef.current) setLoading(true);

      if (videos.length === 0) {
        const episodes = await SERVICES[service]?.getMovieEpisodes(
          SERVICES[service]?.baseUrl,
          source ?? ''
        );
        videos.push(...episodes);
      }

      let m3uContent = '#EXTM3U\n';
      for (const video of videos) {
        m3uContent += `#EXTINF:-1,${video.title}\n${video.source}\n`;
      }

      const safeName = playlistName.replace(/\s+/g, '_');
      const file = new File(Paths.cache, `${safeName}.m3u`);

      if (file.exists) file.delete();

      file.write(m3uContent);

      const intentParams = {
        data: file.contentUri,
        type: 'application/vnd.apple.mpegurl',
        flags: 1
      };

      if (PLAYERS[player] && PLAYERS[player]?.packageName !== 'default') {
        try {
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
            ...intentParams,
            packageName: PLAYERS[player].packageName
          });
        } catch {
          console.warn(
            `[openPlaylist] ${PLAYERS[player].name} недоступний, відкриваємо системний вибір`
          );
          await IntentLauncher.startActivityAsync('android.intent.action.VIEW', intentParams);
        }
      } else {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', intentParams);
      }

      ToastAndroid.show(`${playlistName} відкривається`, ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error opening playlist:', error);
      ToastAndroid.show(`Не вдалося відкрити ${playlistName}`, ToastAndroid.SHORT);
      if (isMountedRef.current) setLoading(false);
    }
  };

  const fetchMovie = useCallback(async () => {
    if (!source) return;
    try {
      if (isMountedRef.current) setLoading(true);
      const response = await SERVICES[service]?.getMovieDetails(SERVICES[service]?.baseUrl, source);
      if (!isMountedRef.current) return;
      setMovie(response);
    } catch (error) {
      if (!isMountedRef.current) return;
      ToastAndroid.show('Помилка завантаження фільму', ToastAndroid.SHORT);
      console.error('Movie loading error:', error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [source, service]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

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
                openPlaylist(movie.episodes ?? [], movie.title || movie.originalTitle || 'Відео');
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
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>IMDB:</Text> {movie.imdb}
                </Text>
              )}
              {movie.year && movie.year.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Рік виходу:</Text> {movie.year}
                </Text>
              )}
              {movie.age && movie.age.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Вік. рейтинг:</Text> {movie.age}
                </Text>
              )}
              {movie.duration && movie.duration.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Тривалість:</Text> {movie.duration}
                </Text>
              )}
              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Жанр:</Text> {movie.genres.join(', ')}
                </Text>
              )}
              {Array.isArray(movie.countries) && movie.countries.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Країна:</Text> {movie.countries.join(', ')}
                </Text>
              )}
              {Array.isArray(movie.directors) && movie.directors.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Режисер:</Text> {movie.directors.join(', ')}
                </Text>
              )}
              {Array.isArray(movie.actors) && movie.actors.length > 0 && (
                <Text style={styles.bodyText}>
                  <Text style={styles.bodyTextBold}>Актори:</Text> {movie.actors.join(', ')}
                </Text>
              )}

              <Separator />

              {movie.description && movie.description.length > 0 && (
                <Text style={styles.description}>{movie.description}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const { spacing, radius, typography } = AppTheme;

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scrollContent: {
    gap: spacing(2.5)
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
    width: spacing(5)
  },
  titleCenter: {
    flex: 1,
    alignItems: 'center'
  },
  bookmarkButton: {
    aspectRatio: 1,
    width: spacing(6),
    height: spacing(6),
    borderRadius: AppTheme.radius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    color: AppTheme.colors.text,
    textAlign: 'center',
    fontSize: typography.xxxl,
    fontWeight: 'bold'
  },
  headerOriginalText: {
    color: AppTheme.colors.subtext,
    textAlign: 'center',
    fontSize: typography.lg
  },
  bodyText: {
    color: AppTheme.colors.text,
    fontSize: typography.lg
  },
  bodyTextBold: {
    fontWeight: 'bold',
    fontSize: typography.xl
  },
  description: {
    color: AppTheme.colors.subtext,
    fontSize: typography.md,
    fontWeight: '500',
    lineHeight: 22,
    flexWrap: 'wrap'
  },
  headerImage: {
    aspectRatio: 2 / 3,
    borderRadius: radius.sm
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
    borderRadius: radius.sm
  },
  playButtonText: {
    color: AppTheme.colors.text,
    fontWeight: 'bold',
    marginLeft: spacing(0.75)
  },
  separator: {
    height: AppTheme.metrics.hairline,
    marginVertical: spacing(1),
    backgroundColor: AppTheme.colors.border
  }
});
