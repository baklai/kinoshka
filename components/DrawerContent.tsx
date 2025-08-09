import categories from '@/constants/Categories';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image } from 'expo-image';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TVFocusGuideView,
  View
} from 'react-native';

export default function DrawerContent(props: any) {
  const { navigation } = props;

  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={styles.drawerContainer}
    >
      <View style={styles.menuContainer}>
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={{ width: 50, height: 50 }}
          contentFit="cover"
        />
        <Text style={styles.menuTitle}>KinoshkaTV</Text>
      </View>

      <TVFocusGuideView
        autoFocus
        style={styles.guideViewContainer}
        trapFocusRight
        trapFocusDown
        trapFocusUp
      >
        <View style={styles.dd}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={{ width: '100%', flexGrow: 1 }}
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
          </ScrollView>

          <View style={styles.bottomContainer}>
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
        </View>
      </TVFocusGuideView>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingStart: 0,
    paddingEnd: 0
  },

  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    height: scaledPixels(90),
    backgroundColor: '#1B1C1E',
    borderBottomColor: '#17171A',
    borderBottomWidth: 1
  },

  menuTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scaledPixels(24),
    textAlign: 'left'
  },

  guideViewContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  dd: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  bottomContainer: {
    width: '100%',
    paddingVertical: scaledPixels(8)
  },

  separator: {
    height: scaledPixels(1),
    marginVertical: scaledPixels(8),
    backgroundColor: '#333'
  }
});
