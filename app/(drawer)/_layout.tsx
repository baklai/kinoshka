import DrawerContent from '@/components/DrawerContent';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Drawer
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          lazy: true,
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
          drawerStatusBarAnimation: 'slide'
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
