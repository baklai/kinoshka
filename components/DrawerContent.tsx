import {
  AboutSvgIcon,
  BookmarkSvgIcon,
  CartoonsSvgIcon,
  ExitSvgIcon,
  HistorySvgIcon,
  MoviesSvgIcon,
  NewsSvgIcon,
  OptionsSvgIcon,
  SeriesSvgIcon,
  TVShowsSvgIcon
} from '@/components/StyledIcons';
import { scaledPixels } from '@/hooks/useScaledPixels';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

const Separator = () => <View style={styles.separator} />;

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { navigation } = props;

  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.toggleDrawer();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <TVFocusGuideView style={{ flex: 1 }} trapFocusRight trapFocusDown trapFocusUp trapFocusLeft>
      <View style={styles.headerContainer} hasTVPreferredFocus>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 32, height: 32 }}
          contentFit="cover"
        />
        <Text style={styles.headerTitle}>KinoshkaTV</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScrollContainer}>
        <DrawerItem
          key="news"
          label="Новинки"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <NewsSvgIcon {...props} />}
          onPress={() => navigation.navigate('index')}
        />

        <DrawerItem
          key="movies"
          label="Фільми"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <MoviesSvgIcon {...props} />}
          onPress={() => navigation.navigate('index')}
        />
        <DrawerItem
          key="series"
          label="Серіали"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <SeriesSvgIcon {...props} />}
          onPress={() => navigation.navigate('index')}
        />
        <DrawerItem
          key="cartoons"
          label="Мультфільми"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <CartoonsSvgIcon {...props} />}
          onPress={() => navigation.navigate('index')}
        />
        <DrawerItem
          key="tvshows"
          label="Телепередачі"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <TVShowsSvgIcon {...props} />}
          onPress={() => navigation.navigate('index')}
        />
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        <DrawerItem
          label="Історія"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <HistorySvgIcon />}
          onPress={() => navigation.navigate('history')}
        />

        <DrawerItem
          label="Закладки"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <BookmarkSvgIcon />}
          onPress={() => navigation.navigate('bookmarks')}
        />

        <Separator />

        <DrawerItem
          label="Налаштування"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <OptionsSvgIcon />}
          onPress={() => navigation.navigate('options')}
        />

        <DrawerItem
          label="Про додаток"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <AboutSvgIcon />}
          onPress={() => navigation.navigate('about')}
        />

        <Separator />

        <DrawerItem
          label="Вихід"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <ExitSvgIcon />}
          onPress={handleExit}
        />
      </View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    height: scaledPixels(90),
    gap: scaledPixels(14),
    paddingHorizontal: scaledPixels(18),
    backgroundColor: '#1B1C1E',
    borderBottomColor: '#17171A',
    borderBottomWidth: 1
  },

  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaledPixels(32),
    textAlign: 'left',
    textShadowColor: '#ca563f',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },

  drawerScrollContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingStart: 0,
    paddingEnd: 0
  },

  drawerItem: {
    borderRadius: 0
  },

  drawerItemLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaledPixels(20)
  },

  separator: {
    height: scaledPixels(1),
    marginVertical: scaledPixels(8),
    backgroundColor: '#17171A'
  },

  footerContainer: {
    flexDirection: 'column'
  }
});
