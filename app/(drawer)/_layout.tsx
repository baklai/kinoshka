import DrawerContent from '@/components/DrawerContent';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useCallback } from 'react';
import { Platform, useTVEventHandler } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const myTVEventHandler = useCallback(
    (evt: { eventType: string }) => {
      if (evt.eventType === 'back') {
        const isDrawerOpen = navigation
          .getState()
          .history.some((item: any) => item.type === 'drawer');

        if (!isDrawerOpen) {
          navigation.openDrawer();
          return true;
        }
      }
      return false;
    },
    [navigation]
  );

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'red' }}>
      <Drawer
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          swipeEnabled: true,
          swipeEdgeWidth: 50,
          drawerType: 'back',
          drawerPosition: 'left',
          drawerStyle: {
            backgroundColor: '#202124',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.9), 0 8px 10px -6px rgba(0,0,0,0.9)',
            width: 280
          },
          overlayColor: 'rgba(0,0,0,0.6)',
          keyboardDismissMode: 'none',
          drawerHideStatusBarOnOpen: true,
          drawerStatusBarAnimation: 'slide',
          lazy: true
        }}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="about" />
        <Drawer.Screen name="details" />
        <Drawer.Screen name="options" />
        <Drawer.Screen name="history" />
        <Drawer.Screen name="bookmarks" />
      </Drawer>
    </GestureHandlerRootView>
  );
}
