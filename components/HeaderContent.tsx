import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, TVFocusGuideView, View, ViewProps } from 'react-native';

interface HeaderContentProps extends ViewProps {}

const HeaderContent = (props: HeaderContentProps) => {
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

  return (
    <TVFocusGuideView trapFocusLeft trapFocusRight trapFocusUp>
      <View style={[styles.container, props.style]}>
        <View style={styles.section}>
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
                  focused && { color: AppTheme.colors.surface },
                  pressed && { opacity: 0.7 }
                ]}
              >
                {({ focused, pressed }) => (
                  <View style={[styles.touchableText, pressed && { opacity: 0.7 }]}>
                    <Text
                      style={[
                        styles.label,
                        focused && styles.withUnderline,
                        focused && !isCurrentRoute && { borderColor: AppTheme.colors.border },
                        isCurrentRoute && styles.labelFocuse
                      ]}
                    >
                      {title.toUpperCase()}
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
                  focused && { backgroundColor: AppTheme.colors.surface },
                  pressed && { opacity: 0.7 }
                ]}
              >
                {({ focused, pressed }) => (
                  <View style={[styles.iconWrapper, pressed && { opacity: 0.7 }]}>
                    <StyledIcon
                      size="large"
                      color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
                      name={icon as ComponentProps<typeof MaterialCommunityIcons>['name']}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.colors.background,

    borderColor: 'red',
    borderWidth: scaledPixels(1)
  },

  section: {
    gap: scaledPixels(6),
    flexDirection: 'row',
    alignItems: 'center'
  },

  touchableText: {
    // paddingVertical: scaledPixels(3),
    // paddingHorizontal: scaledPixels(12)

    borderColor: 'red',
    borderWidth: 1
  },

  touchableIcon: {
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: scaledPixels(48 / 2),
    alignItems: 'center',
    justifyContent: 'center',

    borderColor: 'red',
    borderWidth: 1
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  label: {
    color: AppTheme.colors.subtext,
    fontWeight: '500',
    fontSize: scaledPixels(18),
    paddingVertical: scaledPixels(6)
  },

  labelFocuse: {
    color: AppTheme.colors.text,
    fontWeight: 'bold'
  },

  withUnderline: {
    borderBottomWidth: scaledPixels(3),
    borderColor: AppTheme.colors.text,
    alignSelf: 'flex-start'
  }
});

export default HeaderContent;
