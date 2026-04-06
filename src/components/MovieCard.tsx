import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme, BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { MovieProps } from '@/types/movie.type';

interface MovieCardProps extends MovieProps {
  style?: ViewStyle;
  onPress: (source: string, title: string) => void;
}

export const MovieCard = React.memo(
  ({ source, poster, title, imdb, likes, quality, style, onPress }: MovieCardProps) => {
    const [focused, setFocused] = useState(false);

    const handlePress = useCallback(() => onPress(source, title ?? ''), [onPress, source, title]);
    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const rating = imdb || likes;

    return (
      <Pressable
        focusable
        onPress={handlePress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={[style]}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={poster}
            placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
            contentFit="cover"
            transition={0}
            cachePolicy="memory-disk"
            recyclingKey={source}
          />
          <View style={styles.scrim} />
          <View style={styles.overlayTop}>
            {rating ? (
              <View style={styles.rating}>
                <Text style={styles.ratingText}>{rating}</Text>
              </View>
            ) : (
              <View />
            )}
            {quality ? (
              <View style={styles.quality}>
                <Text style={styles.qualityText}>{quality}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>
          {focused && <View style={styles.borderOverlay} />}
          {focused && (
            <StyledIcon
              icon="play-circle"
              size="xlarge"
              color={AppTheme.colors.primary}
              style={styles.playIcon}
            />
          )}
        </View>
      </Pressable>
    );
  },
  (prev, next) =>
    prev.source === next.source &&
    prev.poster === next.poster &&
    prev.title === next.title &&
    prev.style === next.style
);

MovieCard.displayName = 'MovieCard';

const { spacing, radius, typography } = AppTheme;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
    overflow: 'hidden'
  },
  image: {
    ...StyleSheet.absoluteFill,
    backgroundColor: AppTheme.colors.background
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    background: undefined,
    backgroundImage: undefined,
    backgroundColor: 'transparent',
    borderRadius: radius.sm
  } as any,
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'absolute',
    top: spacing(0.75),
    left: spacing(0.75),
    right: spacing(0.75),
    zIndex: 10
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.25),
    backgroundColor: 'rgba(54, 124, 52, 0.6)',
    paddingHorizontal: spacing(0.625),
    paddingVertical: spacing(0.25),
    borderRadius: radius.xs
  },
  ratingText: {
    color: AppTheme.colors.text,
    fontSize: typography.sm,
    fontWeight: '700'
  },
  quality: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing(0.625),
    paddingVertical: spacing(0.25),
    borderRadius: radius.xs
  },
  qualityText: {
    color: AppTheme.colors.text,
    fontSize: typography.xs,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  titleWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing(0.75),
    paddingTop: spacing(0.75),
    paddingBottom: spacing(0.625)
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: typography.sm,
    lineHeight: typography.md,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
  },
  borderOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.sm,
    borderWidth: 2.5,
    borderColor: AppTheme.colors.primary,
    zIndex: 999,
    pointerEvents: 'none'
  },
  playIcon: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9
  }
});
