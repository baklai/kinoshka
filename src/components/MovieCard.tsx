import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { MovieProps } from '@/types/movie.type';

interface MovieCardProps extends MovieProps {
  style?: ViewStyle;
  onPress: (source: string) => void;
}

export const MovieCard = React.memo(
  ({ source, poster, title, imdb, likes, quality, style, onPress }: MovieCardProps) => {
    const [focused, setFocused] = useState(false);

    const handlePress = useCallback(() => onPress(source), [onPress, source]);
    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    return (
      <Pressable
        focusable
        onPress={handlePress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[style, focused && styles.focused]}
      >
        <View style={styles.container}>
          {focused && <View style={styles.borderOverlay} />}

          <Image
            style={styles.image}
            source={poster}
            placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
            contentFit="cover"
            transition={300}
          />

          <View style={styles.overlayTop}>
            {imdb || likes ? (
              <View style={styles.rating}>
                <Text style={styles.ratingText}>{imdb || likes}</Text>
              </View>
            ) : (
              <View />
            )}
            {quality && (
              <View style={styles.quality}>
                <Text style={styles.qualityText}>{quality}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.overlayBottom}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {focused && (
          <StyledIcon
            icon="play-circle"
            size="xlarge"
            color={AppTheme.colors.primary}
            style={styles.playIcon}
          />
        )}
      </Pressable>
    );
  }
);

MovieCard.displayName = 'MovieCard';

const { spacing, radius, typography, metrics } = AppTheme;

const styles = StyleSheet.create({
  focused: {
    opacity: 0.5
  },
  container: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm
  },
  borderOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: AppTheme.colors.primary,
    zIndex: 999,
    pointerEvents: 'none'
  },
  image: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.sm,
    backgroundColor: AppTheme.colors.background
  },
  playIcon: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: spacing(1),
    left: spacing(0.5),
    right: spacing(0.5),
    zIndex: 10
  },
  overlayBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: `${AppTheme.colors.surface}80`,
    borderBottomLeftRadius: radius.xs,
    borderBottomRightRadius: radius.xs,
    paddingVertical: spacing(0.5),
    bottom: 0,
    left: 0,
    right: 0
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#19875480',
    paddingHorizontal: spacing(0.5),
    paddingVertical: spacing(0.25),
    borderRadius: radius.xs,
    marginBottom: spacing(0.5),
    gap: spacing(0.25)
  },
  ratingText: {
    color: AppTheme.colors.text,
    fontSize: typography.sm,
    paddingHorizontal: spacing(0.375)
  },
  quality: {
    backgroundColor: '#00000070',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing(0.75),
    paddingVertical: spacing(0.25),
    borderRadius: radius.xs,
    marginBottom: spacing(0.5)
  },
  qualityText: {
    color: AppTheme.colors.text,
    fontSize: typography.sm
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: typography.lg,
    paddingHorizontal: spacing(0.25),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  }
});
