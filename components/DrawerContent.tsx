import { StyledIcon } from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, TVFocusGuideView, View } from 'react-native';

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
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScrollContainer}
        hasTVPreferredFocus
      >
        <DrawerItem
          key="movies"
          label="Фільми"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="filmstrip-box" />}
          onPress={() => navigation.navigate('index')}
        />
        <DrawerItem
          key="series"
          label="Серіали"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="filmstrip-box-multiple" />}
          onPress={() => navigation.navigate('index')}
        />
        <DrawerItem
          key="cartoons"
          label="Мультфільми"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="sticker-emoji" />}
          onPress={() => navigation.navigate('index')}
        />
        <DrawerItem
          key="tvshows"
          label="Телепередачі"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="youtube-tv" />}
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
          icon={() => <StyledIcon name="history" />}
          onPress={() => navigation.navigate('history')}
        />

        <DrawerItem
          label="Закладки"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="bookmark" />}
          onPress={() => navigation.navigate('bookmarks')}
        />

        <Separator />

        <DrawerItem
          label="Налаштування"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="cog-outline" />}
          onPress={() => navigation.navigate('options')}
        />

        <DrawerItem
          label="Про додаток"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="information-outline" />}
          onPress={() => navigation.navigate('about')}
        />

        <Separator />

        <DrawerItem
          label="Вихід"
          pressOpacity={0.5}
          pressColor="#ca563f"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={() => <StyledIcon name="exit-to-app" />}
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
