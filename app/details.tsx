import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

const Separator = () => <View style={styles.separator} />;

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useWindowDimensions();
  const { loading, findOneById } = useAsyncFetch('movies');
  const [movie, setMovie] = useState<MovieProps | null>(null);

  const isPortrait = height >= width;

  const openInVLC = async (url: string) => {
    const vlcUrl = `vlc://${url}`;
    const supported = await Linking.canOpenURL(vlcUrl);
    if (supported) {
      await Linking.openURL(vlcUrl);
    } else {
      alert('VLC не встановлено або схема не підтримується');
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const response = await findOneById(id);
          setMovie(response);
        }
      } catch (error) {
        console.error('Movie loading error:', error);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading && !movie) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={AppTheme.colors.text} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StyledIcon name="movie-off-outline" size="xlarge" />
        <Text style={{ color: AppTheme.colors.text }}>Відео не знайдено</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { flexDirection: isPortrait ? 'column' : 'row' }]}>
      <View style={[styles.imageContainer, { width: isPortrait ? width : scaledPixels(400) }]}>
        <Image
          style={styles.headerImage}
          source={movie?.poster}
          placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
          contentFit="cover"
          transition={1000}
        />

        <View style={styles.headerButtonContainer}>
          <Pressable
            focusable
            onPress={() => openInVLC(movie?.episodes?.[0]?.source ?? '')}
            style={({ focused, pressed }) => [
              styles.playButton,
              focused && { backgroundColor: AppTheme.colors.muted },
              pressed && { opacity: 0.7 }
            ]}
          >
            <View style={styles.playButtonContent}>
              <StyledIcon name="play-circle-outline" />
              <Text style={styles.playButtonText}>Дивитись відео</Text>
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
          {movie?.title && <Text style={styles.headerTitle}>{movie.title}</Text>}
          {movie?.originalTitle && (
            <Text style={styles.headerOriginalText}>{movie.originalTitle}</Text>
          )}
          {movie?.year && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Рік виходу:</Text> {movie.year}
            </Text>
          )}
          {movie?.imdb && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>IMDB:</Text> {movie.imdb}
            </Text>
          )}
          {movie?.age && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Вік. рейтинг:</Text> {movie.age}
            </Text>
          )}
          {movie?.duration && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Тривалість:</Text> {movie.duration}
            </Text>
          )}
          {movie?.genres?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Жанр:</Text> {movie.genres.join(', ')}
            </Text>
          )}
          {movie?.countries?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Країна:</Text> {movie.countries.join(', ')}
            </Text>
          )}
          {movie?.directors?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Режисер:</Text> {movie.directors.join(', ')}
            </Text>
          )}
          {movie?.actors?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Актори:</Text> {movie.actors.join(', ')}
            </Text>
          )}

          <Separator />

          {movie?.description && <Text style={styles.headerDescription}>{movie.description}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: scaledPixels(10)
  },
  imageContainer: {
    width: 'auto',
    height: 'auto'
  },
  textContainer: {
    flexDirection: 'column',
    flexShrink: 1
  },
  image: {
    flex: 1
  },
  headerTitle: {
    color: AppTheme.colors.text,
    textAlign: 'center',
    fontSize: scaledPixels(28),
    fontWeight: 'bold'
  },
  headerOriginalText: {
    color: AppTheme.colors.text,
    textAlign: 'left',
    fontSize: scaledPixels(24),
    fontWeight: 'bold'
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
    color: AppTheme.colors.text,
    fontSize: scaledPixels(16),
    fontWeight: '500',
    lineHeight: 22,
    flexWrap: 'wrap'
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
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: scaledPixels(24),
    paddingVertical: scaledPixels(8),
    borderRadius: scaledPixels(6)
  },
  playButtonContent: {
    flexDirection: 'row',
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
