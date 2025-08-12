import StyledIcon from '@/components/StyledIcon';
import categories from '@/constants/Categories';
import { scaledPixels } from '@/hooks/useScaledPixels';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native';

const Separator = () => <View style={styles.separator} hasTVPreferredFocus />;

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
    <>
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 32, height: 32 }}
          contentFit="cover"
        />
        <Text style={styles.headerTitle}>KinoshkaTV</Text>
      </View>

      <DrawerContentScrollView
        {...props}
        scrollEnabled
        hasTVPreferredFocus
        contentContainerStyle={styles.drawerScrollContainer}
      >
        {categories.map((category, index) => (
          <DrawerItem
            key={category.name}
            label={category.description}
            style={styles.drawerItem}
            labelStyle={styles.drawerItemLabel}
            icon={({ color, size }) => (
              <StyledIcon color={color} name={category.icon || 'folder-open-outline'} />
            )}
            onPress={() => navigation.navigate('index')}
          />
        ))}
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        <DrawerItem
          label="Історія"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <StyledIcon color={color} name="history" />}
          onPress={() => navigation.navigate('history')}
        />

        <DrawerItem
          label="Закладки"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <StyledIcon color={color} name="bookmark" />}
          onPress={() => navigation.navigate('bookmarks')}
        />

        <Separator />

        <DrawerItem
          label="Налаштування"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <StyledIcon color={color} name="cog-outline" />}
          onPress={() => navigation.navigate('options')}
        />

        <DrawerItem
          label="Про додаток"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <StyledIcon color={color} name="information-outline" />}
          onPress={() => navigation.navigate('about')}
        />

        <Separator />

        <DrawerItem
          label="Вихід"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <StyledIcon color={color} name="exit-to-app" />}
          onPress={handleExit}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
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
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
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
    color: '#fff'
  },

  separator: {
    height: scaledPixels(1),
    marginVertical: scaledPixels(8),
    backgroundColor: '#17171A'
  },

  footerContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});
