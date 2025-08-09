import MoviesFlatList from '@/components/MoviesFlatList';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MovieProps } from '@/types/movie.type';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TVFocusGuideView,
  useTVEventHandler,
  View
} from 'react-native';

export default function IndexScreen() {
  const [focusedItem, setFocusedItem] = useState<MovieProps | null>(null);

  const upTVEventHandler = useCallback((evt: { eventType: string }) => {
    if (
      evt.eventType === 'up' ||
      evt.eventType === 'down' ||
      evt.eventType === 'left' ||
      evt.eventType === 'right'
    ) {
      if (focusedItem) {
        setFocusedItem(null);
        return true;
      }
    }

    return false;
  }, []);

  if (Platform.isTV) {
    useTVEventHandler(upTVEventHandler);
  }

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const renderHeader = useCallback(
    () => (
      <Animated.View>
        <View style={styles.headerContainer}>
          <View style={styles.headerImageContainer}>
            <Image
              style={styles.headerImage}
              source={focusedItem?.poster}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{focusedItem?.title}</Text>
            <Text style={styles.headerText}>Якість: 1080p</Text>
            <Text style={styles.headerText}>Рік виходу: {focusedItem?.year}</Text>
            <Text style={styles.headerDescription}>{focusedItem?.description}</Text>
            <View style={styles.fixToText}>
              <Button title="View video" onPress={() => Alert.alert('Left button pressed')} />
              <Button title="Favorite" onPress={() => Alert.alert('Right button pressed')} />
            </View>
          </View>
        </View>
      </Animated.View>
    ),
    [focusedItem]
  );

  const hendleSelectItem = (value: MovieProps) => {
    setFocusedItem(value);
  };

  return (
    <>
      {focusedItem && renderHeader()}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: scaledPixels(14) }}
        showsVerticalScrollIndicator={false}
      >
        <TVFocusGuideView trapFocusLeft>
          <MoviesFlatList
            api={apiUrl}
            category="Фільми"
            filters={{ category: 'filmy' }}
            onPress={hendleSelectItem}
          />
        </TVFocusGuideView>

        <TVFocusGuideView trapFocusLeft>
          <MoviesFlatList
            api={apiUrl}
            category="Серіали"
            filters={{ category: 'seriesss' }}
            onPress={hendleSelectItem}
          />
        </TVFocusGuideView>

        <TVFocusGuideView trapFocusLeft>
          <MoviesFlatList
            api={apiUrl}
            category="Мультфільми"
            filters={{ category: 'cartoon' }}
            onPress={hendleSelectItem}
          />
        </TVFocusGuideView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  fixToText: {
    gap: scaledPixels(8),
    flexDirection: 'row',
    paddingVertical: scaledPixels(8)
  },
  headerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: scaledPixels(10),
    backgroundColor: '#202124'
  },
  headerTitle: {
    color: '#fff',
    fontSize: scaledPixels(28),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10)
  },
  headerText: {
    color: '#fff',
    fontSize: scaledPixels(22)
  },
  headerDescription: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: '500',
    paddingTop: scaledPixels(16),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: scaledPixels(10),
    lineHeight: 22,
    marginTop: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '80%'
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
  headerTextContainer: {}
});
