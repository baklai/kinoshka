import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { IconType } from '@/types/icons.type';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';

interface HeaderContentProps extends ViewProps {}

export const HeaderContent = (props: HeaderContentProps) => {
  const router = useRouter();

  const navTabs: { title: string; route: string }[] = [
    { title: 'Пошук', route: '/search' },
    { title: 'Кіношка', route: '/' },
    { title: 'Закладки', route: '/bookmarks' }
  ];

  const navBtns: { icon: IconType; route: string; onPress?: () => void }[] = [
    { icon: 'history', route: '/history' },
    { icon: 'information-outline', route: '/about' },
    { icon: 'cog-outline', route: '/options' },
    {
      icon: 'exit-to-app',
      route: '/exit',
      onPress: () => {
        Alert.alert('Зачекай!', 'Ви впевнені, що хочете вийти?', [
          {
            text: 'Скасувати',
            onPress: () => null
          },
          { text: 'Так', onPress: () => BackHandler.exitApp() }
        ]);
      }
    }
  ];

  return (
    <View style={[styles.container, props.style]} hasTVPreferredFocus={false}>
      <View style={styles.section}>
        {navTabs.map(({ title, route }, idx) => {
          return (
            <Pressable
              key={idx}
              onPress={() => router.push(route)}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              {({ focused }) => (
                <Text style={[styles.label, focused && styles.underlineFocused]}>
                  {title.toUpperCase()}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        {navBtns.map(({ icon, route, onPress }, idx) => {
          return (
            <Pressable
              key={idx}
              onPress={() => (onPress ? onPress() : router.push(route))}
              style={({ focused, pressed }) => [
                styles.pressableIcon,
                focused && { backgroundColor: AppTheme.colors.surface },
                pressed && { opacity: 0.7 }
              ]}
            >
              {({ focused }) => (
                <StyledIcon
                  size="large"
                  color={focused ? AppTheme.colors.primary : AppTheme.colors.subtext}
                  icon={icon as IconType}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.colors.background
  },

  section: {
    gap: scaledPixels(20),
    flexDirection: 'row',
    alignItems: 'center'
  },

  pressableIcon: {
    aspectRatio: 1,
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  label: {
    fontWeight: '500',
    color: AppTheme.colors.subtext,
    fontSize: scaledPixels(18),
    paddingVertical: scaledPixels(6)
  },

  underlineFocused: {
    color: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
    borderBottomWidth: scaledPixels(3),
    fontSize: scaledPixels(20),
    alignSelf: 'flex-start'
  },

  focused: {
    color: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
    fontWeight: 'bold'
  },

  pressed: {
    color: AppTheme.colors.text,
    borderColor: AppTheme.colors.text
  }
});
