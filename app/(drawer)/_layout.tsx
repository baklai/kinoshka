import DrawerContent from '@/components/DrawerContent';
import OptionsButton from '@/components/OptionsButton';
import SearchableButton from '@/components/SearchableButton';
import SortableButton from '@/components/SortableButton';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} hasTVPreferredFocus={true}>
      <Drawer
        drawerContent={props => <DrawerContent {...props} />}
        defaultStatus="open"
        screenOptions={{
          lazy: true,
          headerShown: true,
          swipeEnabled: true,
          swipeEdgeWidth: 50,
          drawerType: 'back',
          drawerPosition: 'left',
          drawerStyle: {
            backgroundColor: '#202124',
            width: scaledPixels(320)
          },
          overlayColor: 'rgba(0,0,0,0.6)',
          keyboardDismissMode: 'none',
          drawerHideStatusBarOnOpen: true,
          drawerStatusBarAnimation: 'slide',
          headerStyle: {
            backgroundColor: '#1B1C1E'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold'
          },

          headerLeft: () => null,
          headerRight: () => (
            <View style={styles.headerRight}>
              <SearchableButton onSearch={q => console.log('Пошук:', q)} />
              <SortableButton
                fields={['sdfg', 'asdfas']}
                onSort={s => console.log('Сортування:', s)}
              />
              <OptionsButton />
            </View>
          )
        }}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="about" />
        <Drawer.Screen name="options" />
        <Drawer.Screen name="history" />
        <Drawer.Screen name="bookmarks" />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(8),
    justifyContent: 'flex-end',
    paddingHorizontal: scaledPixels(10)
  }
});
