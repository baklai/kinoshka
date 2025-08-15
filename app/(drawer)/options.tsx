import { OptionsSvgIcon } from '@/components/StyledIcons';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';

export default function OptionsScreen() {
  return (
    <>
      <Drawer.Screen
        options={{
          headerRight: () => null,
          headerTitle: () => (
            <View style={styles.header}>
              <OptionsSvgIcon />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Налаштування</Text>
            </View>
          )
        }}
      />

      <View style={styles.container}>
        <Video
          source={{
            uri: 'https://ashdi.vip/video14/3/new/sonic_the_hedgehog_2020_ukreng_sub.ukreng_webdl_1080p_hurtom_16568/hls/BKaMlHaOlPtdnwnhBYo=/index.m3u8'
          }}
          controls={true}
          style={styles.video}
          resizeMode="contain"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10)
  },
  container: {
    flex: 1,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
    // overflowX: 'auto',
    padding: 6,
    gap: 6
  },
  video: { flex: 1 }
});
