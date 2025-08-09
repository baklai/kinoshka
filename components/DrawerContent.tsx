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
import {
  BackHandler,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useTVEventHandler,
  View
} from 'react-native';

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
    BackHandler.exitApp();
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
          <TouchableOpacity
            key={category.name}
            hasTVPreferredFocus={index === 0}
            onPress={() => navigation.navigate('index')}
          >
            <DrawerItem
              label={category.description}
              icon={({ focused, color, size }) => (
                <MaterialIcons color={color} size={size} name={category.icon || 'folder'} />
              )}
              onPress={() => navigation.navigate('index')}
            />
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('history')}>
          <DrawerItem
            label="Історія"
            icon={({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="history" />
            )}
            onPress={() => navigation.navigate('history')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('bookmarks')}>
          <DrawerItem
            label="Закладки"
            icon={({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="bookmark" />
            )}
            onPress={() => navigation.navigate('bookmarks')}
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity onPress={() => navigation.navigate('options')}>
          <DrawerItem
            label="Налаштування"
            icon={({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="settings" />
            )}
            onPress={() => navigation.navigate('options')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('about')}>
          <DrawerItem
            label="Про додаток"
            icon={({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="info" />
            )}
            onPress={() => navigation.navigate('about')}
          />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity>
          <DrawerItem
            label="Вихід"
            icon={({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="exit-to-app" />
            )}
            onPress={handleExit}
          />
        </TouchableOpacity>
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

  footerContainer: {
    width: '100%',
    paddingVertical: scaledPixels(8)
  },

  separator: {
    height: scaledPixels(1),
    marginVertical: scaledPixels(8),
    backgroundColor: '#17171A'
  }
});
