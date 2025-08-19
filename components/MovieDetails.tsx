import DropdownButton from '@/components/DropdownButton';
import { BLUR_HASH_MOVIE_CARD } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MovieDetailsProps extends MovieProps {
  animated: any;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Separator = () => <View style={styles.separator} />;

const MovieDetails = (props: MovieDetailsProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handlePlay = (episode?: string) => {
    Alert.alert('Проигрывание', episode ? `Серия: ${episode}` : 'Фильм');
  };

  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
  };

  return (
    <Animated.View style={[styles.animatedContainer, { opacity: props.animated }]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.linearGradientBackground}
      />

      <View style={styles.container}>
        <Image
          style={styles.image}
          source="https://picsum.photos/seed/696/3000/2000"
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      </View>

      <View style={styles.headerContainer}>
        <View style={styles.headerImageContainer}>
          <Image
            style={styles.headerImage}
            source={{ uri: 'https://picsum.photos/seed/696/3000/2000' }}
            placeholder={{ blurhash: BLUR_HASH_MOVIE_CARD }}
            contentFit="cover"
            transition={1000}
          />

          <View style={styles.headerButtonContainer}>
            <DropdownButton episodes={props?.episodes} onPlay={handlePlay} />
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

        <View style={styles.headerTextContainer}>
          {props?.title && <Text style={styles.headerTitle}>{props.title}</Text>}
          {props?.originalTitle && (
            <Text style={styles.headerOriginalText}>{props.originalTitle}</Text>
          )}
          {props?.year && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Рік виходу:</Text> {props.year}
            </Text>
          )}
          {props?.imdb && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>IMDB:</Text> {props.imdb}
            </Text>
          )}
          {props?.age && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Вік. рейтинг:</Text> {props.age}
            </Text>
          )}
          {props?.duration && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Тривалість:</Text> {props.duration}
            </Text>
          )}
          {props?.genres?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Жанр:</Text> {props.genres.join(', ')}
            </Text>
          )}
          {props?.countries?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Країна:</Text> {props.countries.join(', ')}
            </Text>
          )}
          {props?.directors?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Режисер:</Text> {props.directors.join(', ')}
            </Text>
          )}
          {props?.actors?.length && (
            <Text style={styles.headerText}>
              <Text style={styles.textBold}>Актори:</Text> {props.actors.join(', ')}
            </Text>
          )}

          <Separator />

          {props?.description && <Text style={styles.headerDescription}>{props.description}</Text>}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553'
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
    textAlign: 'center',
    fontSize: scaledPixels(28),
    fontWeight: 'bold'
  },
  headerOriginalText: {
    color: '#fff',
    textAlign: 'left',
    fontSize: scaledPixels(24),
    fontWeight: 'bold'
  },
  headerTextContainer: {
    flexDirection: 'column',
    flexShrink: 1
  },
  headerText: {
    color: '#fff',
    fontSize: scaledPixels(18)
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: scaledPixels(20)
  },
  headerDescription: {
    color: '#fff',
    fontSize: scaledPixels(16),
    fontWeight: '500',
    lineHeight: 22,
    flexWrap: 'wrap'
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
  },
  separator: {
    height: scaledPixels(1),
    marginVertical: scaledPixels(8),
    backgroundColor: '#17171A'
  }
});

export default MovieDetails;
