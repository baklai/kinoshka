import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/ui.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';
import SpeechButton from './SpeechButton';

export default function HeaderContent() {
  const pathname = usePathname();

  const navTabs = [
    { title: 'Пошук', route: '/search' },
    { title: 'Головна', route: '/' },
    { title: 'Закладки', route: '/bookmarks' }
  ];

  const navBtns = [
    { icon: 'history', route: '/history' },
    { icon: 'information-outline', route: '/about' },
    { icon: 'cog-outline', route: '/options' }
  ];

  const handleMicrophone = () => {
    return null;
  };

  return (
    <TVFocusGuideView trapFocusLeft trapFocusRight trapFocusUp>
      <View style={styles.container}>
        <View style={styles.section}>
          <SpeechButton onPress={handleMicrophone} />

          {navTabs.map(({ title, route }, idx) => {
            const isCurrentRoute = pathname === route;

            return (
              <Pressable
                key={idx}
                focusable
                hasTVPreferredFocus={route === '/'}
                onPress={() => router.replace(route)}
                style={({ focused, pressed }) => [
                  styles.touchableText,
                  focused && { color: '#272727' },
                  pressed && { opacity: 0.7 }
                ]}
              >
                {({ focused, pressed }) => (
                  <View style={[styles.touchableText, pressed && { opacity: 0.7 }]}>
                    <Text
                      style={[
                        styles.label,
                        focused && styles.withUnderline,
                        focused && !isCurrentRoute && { borderColor: '#444444' },
                        isCurrentRoute && styles.labelFocuse
                      ]}
                    >
                      {title}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.section}>
          {navBtns.map(({ icon, route }, idx) => {
            return (
              <Pressable
                key={idx}
                focusable
                onPress={() => router.replace(route)}
                style={({ focused, pressed }) => [
                  styles.touchableIcon,
                  focused && { backgroundColor: '#272727' },
                  pressed && { opacity: 0.7 }
                ]}
              >
                <View style={styles.iconWrapper}>
                  <StyledIcon
                    size="large"
                    name={icon as ComponentProps<typeof MaterialCommunityIcons>['name']}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: scaledPixels(80),
    paddingHorizontal: scaledPixels(8),
    backgroundColor: AppTheme.colors.background
  },

  section: {
    gap: scaledPixels(8),
    flexDirection: 'row',
    alignItems: 'center'
  },

  touchableText: {
    paddingVertical: scaledPixels(3),
    paddingHorizontal: scaledPixels(12)
  },

  touchableIcon: {
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: scaledPixels(48 / 2),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scaledPixels(4)
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  label: {
    color: '#ffffff95',
    fontWeight: '500',
    fontSize: scaledPixels(18),
    paddingVertical: scaledPixels(6)
  },

  labelFocuse: {
    color: '#fff',
    fontWeight: 'bold'
  },

  withUnderline: {
    borderBottomWidth: scaledPixels(3),
    borderColor: '#fff',
    alignSelf: 'flex-start'
  }
});
