import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface MovieCardProps extends MovieProps {
  handlePress?: (item: MovieProps) => void;
}

export default function MovieCard(props: MovieCardProps) {
  const { poster, title, imdb, likes, quality, handlePress } = props;

  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  return (
    <Pressable
      focusable
      onPress={() => handlePress && handlePress(props)}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      {({ focused }) => {
        useEffect(() => {
          Animated.parallel([
            Animated.timing(scale, {
              toValue: focused ? 1.08 : 1,
              duration: 200,
              useNativeDriver: true
            }),
            Animated.timing(glowOpacity, {
              toValue: focused ? 1 : 0,
              duration: 200,
              useNativeDriver: false
            })
          ]).start();
        }, [focused]);

        return (
          <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
            <View style={styles.imageWrapper}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  styles.glowWrapper,
                  { opacity: glowOpacity }
                ]}
              >
                <LinearGradient
                  colors={[AppTheme.colors.primary + '80', 'transparent']}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>

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

              {focused && <View style={styles.overlay} />}
            </View>

            <View style={styles.overlayBottom}>
              <Text style={styles.title}>{title}</Text>
            </View>

            {focused && (
              <StyledIcon
                icon="play-circle"
                size="xlarge"
                color={AppTheme.colors.primary}
                style={styles.playIcon}
              />
            )}
          </Animated.View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: scaledPixels(6),
    overflow: 'visible'
  },
  imageWrapper: {
    width: scaledPixels(181),
    height: scaledPixels(259),
    position: 'relative',
    borderRadius: scaledPixels(6),
    overflow: 'hidden'
  },
  glowWrapper: {
    borderRadius: scaledPixels(6),
    ...StyleSheet.absoluteFillObject
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scaledPixels(6),
    borderWidth: scaledPixels(3),
    borderColor: AppTheme.colors.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    pointerEvents: 'none'
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scaledPixels(6),
    backgroundColor: AppTheme.colors.background
  },
  playIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: scaledPixels(8),
    left: scaledPixels(4),
    right: scaledPixels(4),
    zIndex: 10
  },
  overlayBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: `${AppTheme.colors.surface}80`,
    borderBottomLeftRadius: scaledPixels(3),
    borderBottomRightRadius: scaledPixels(3),
    paddingVertical: scaledPixels(4),
    bottom: 0,
    left: 0,
    right: 0
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#19875480',
    paddingHorizontal: scaledPixels(4),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
    marginBottom: scaledPixels(4),
    gap: scaledPixels(2)
  },
  ratingText: {
    color: AppTheme.colors.text,
    fontSize: scaledPixels(14),
    paddingHorizontal: scaledPixels(3)
  },
  quality: {
    backgroundColor: '#00000070',
    alignSelf: 'flex-start',
    paddingHorizontal: scaledPixels(6),
    paddingVertical: scaledPixels(2),
    borderRadius: scaledPixels(4),
    marginBottom: scaledPixels(4)
  },
  qualityText: {
    color: AppTheme.colors.text,
    fontSize: scaledPixels(14)
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: scaledPixels(18),
    paddingHorizontal: scaledPixels(2),
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
});

// import { StyledIcon } from '@/components/StyledIcon';
// import { AppTheme } from '@/constants/theme.constant';
// import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
// import { scaledPixels } from '@/hooks/useScaledPixels';
// import { MovieProps } from '@/types/movie.type';
// import { Image } from 'expo-image';
// import React from 'react';
// import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

// interface MovieCardProps extends MovieProps {
//   handlePress?: (item: MovieProps) => void;
// }

// export default function MovieCard(props: MovieCardProps) {
//   const { poster, title, imdb, likes, quality, handlePress } = props;

//   return (
//     <Pressable
//       focusable
//       onPress={() => handlePress && handlePress(props)}
//       style={({ pressed }) => [pressed && { opacity: 0.7 }]}
//     >
//       {({ focused }) => (
//         <Animated.View style={[styles.container, { transform: [{ scale: focused ? 1.08 : 1 }] }]}>
//           <View style={styles.imageWrapper}>
//             <Image
//               style={styles.image}
//               source={poster}
//               placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
//               contentFit="cover"
//               transition={1000}
//             />

//             <View style={styles.overlayTop}>
//               {imdb || likes ? (
//                 <View style={styles.rating}>
//                   <Text style={styles.ratingText}>{imdb || likes}</Text>
//                 </View>
//               ) : (
//                 <View />
//               )}

//               {quality && (
//                 <View style={styles.quality}>
//                   <Text style={styles.qualityText}>{quality}</Text>
//                 </View>
//               )}
//             </View>

//             {focused && <View style={styles.overlay} />}
//             {focused && <View style={styles.borderOverlay} />}
//           </View>

//           <View style={styles.overlayBottom}>
//             <Text style={styles.title}>{title}</Text>
//           </View>

//           {focused && (
//             <StyledIcon
//               icon="play-circle"
//               size="xlarge"
//               color={AppTheme.colors.primary}
//               style={styles.playIcon}
//             />
//           )}
//         </Animated.View>
//       )}
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     borderRadius: scaledPixels(6)
//   },
//   imageWrapper: {
//     width: scaledPixels(181),
//     height: scaledPixels(259),
//     position: 'relative',
//     borderRadius: scaledPixels(6),
//     overflow: 'visible'
//   },
//   image: {
//     ...StyleSheet.absoluteFillObject,
//     borderRadius: scaledPixels(6),
//     backgroundColor: AppTheme.colors.background
//   },
//   playIcon: {
//     ...StyleSheet.absoluteFillObject,
//     alignItems: 'center',
//     justifyContent: 'center',
//     opacity: 0.8
//   },
//   overlayTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     position: 'absolute',
//     top: scaledPixels(8),
//     left: scaledPixels(4),
//     right: scaledPixels(4),
//     zIndex: 10
//   },
//   overlayBottom: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     position: 'absolute',
//     backgroundColor: `${AppTheme.colors.surface}80`,
//     borderBottomLeftRadius: scaledPixels(3),
//     borderBottomRightRadius: scaledPixels(3),
//     paddingVertical: scaledPixels(4),
//     bottom: 0,
//     left: 0,
//     right: 0
//   },
//   rating: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#19875480',
//     paddingHorizontal: scaledPixels(4),
//     paddingVertical: scaledPixels(2),
//     borderRadius: scaledPixels(4),
//     marginBottom: scaledPixels(4),
//     gap: scaledPixels(2)
//   },
//   ratingText: {
//     color: AppTheme.colors.text,
//     fontSize: scaledPixels(14),
//     paddingHorizontal: scaledPixels(3)
//   },
//   quality: {
//     backgroundColor: '#00000070',
//     alignSelf: 'flex-start',
//     paddingHorizontal: scaledPixels(6),
//     paddingVertical: scaledPixels(2),
//     borderRadius: scaledPixels(4),
//     marginBottom: scaledPixels(4)
//   },
//   qualityText: {
//     color: AppTheme.colors.text,
//     fontSize: scaledPixels(14)
//   },
//   title: {
//     color: AppTheme.colors.text,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: scaledPixels(18),
//     paddingHorizontal: scaledPixels(2),
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 1
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.6)'
//   },
//   borderOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     borderRadius: scaledPixels(6),
//     borderWidth: scaledPixels(3),
//     borderColor: AppTheme.colors.primary,
//     pointerEvents: 'none'
//   }
// });
