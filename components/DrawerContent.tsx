import categories from '@/constants/Categories';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import { BackHandler, Platform, StyleSheet, Text, useTVEventHandler, View } from 'react-native';

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { navigation } = props;

  const myTVEventHandler = useCallback(
    (evt: { eventType: string }) => {
      if (evt.eventType === 'longLeft') {
        navigation.openDrawer();
        return true;
      }
    },
    [navigation]
  );

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  const handleExit = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={{ width: 50, height: 50 }}
          contentFit="cover"
        />
        <Text style={styles.headerTitle}>KinoshkaTV</Text>
      </View>

      <DrawerContentScrollView
        {...props}
        scrollEnabled
        contentContainerStyle={styles.drawerScrollContainer}
      >
        {categories.map((category, index) => (
          <DrawerItem
            key={category.name}
            label={category.description}
            style={styles.drawerItem}
            labelStyle={styles.drawerItemLabel}
            icon={({ color, size }) => (
              <MaterialIcons color={color} size={size} name={category.icon || 'folder'} />
            )}
            onPress={() => navigation.navigate('index')}
          />
        ))}
      </DrawerContentScrollView>

      <View>
        <DrawerItem
          label="Історія"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <MaterialIcons color={color} size={size} name="history" />}
          onPress={() => navigation.navigate('history')}
        />

        <DrawerItem
          label="Закладки"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <MaterialIcons color={color} size={size} name="bookmark" />}
          onPress={() => navigation.navigate('bookmarks')}
        />

        <View style={styles.separator} />

        <DrawerItem
          label="Налаштування"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <MaterialIcons color={color} size={size} name="settings" />}
          onPress={() => navigation.navigate('options')}
        />

        <DrawerItem
          label="Про додаток"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <MaterialIcons color={color} size={size} name="info" />}
          onPress={() => navigation.navigate('about')}
        />

        <View style={styles.separator} />

        <DrawerItem
          label="Вихід"
          style={styles.drawerItem}
          labelStyle={styles.drawerItemLabel}
          icon={({ color, size }) => <MaterialIcons color={color} size={size} name="exit-to-app" />}
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
    gap: scaledPixels(6),
    backgroundColor: '#1B1C1E',
    borderBottomColor: '#17171A',
    borderBottomWidth: 1
  },

  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaledPixels(24),
    textAlign: 'left'
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
  }
});
