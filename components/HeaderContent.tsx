import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { IconType } from '@/types/icons.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, TVFocusGuideView, View, ViewProps } from 'react-native';

interface HeaderContentProps extends ViewProps {}

const HeaderContent = (props: HeaderContentProps) => {
  const pathname = usePathname();

  const navTabs: { title: string; route: string }[] = [
    { title: 'Пошук', route: '/search' },
    { title: 'Кіношка', route: '/home' },
    { title: 'Закладки', route: '/bookmarks' }
  ];

  const navBtns: { icon: IconType; route: string }[] = [
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
                hasTVPreferredFocus={isCurrentRoute}
                // onFocus={() => !isCurrentRoute && Platform.isTV && router.push(route)}
                onPress={() => router.push(route)}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                {({ focused }) => (
                  <Text
                    style={[
                      styles.label,
                      focused && styles.underline,
                      isCurrentRoute && styles.focused,
                      isCurrentRoute &&
                        !focused && [
                          styles.underline,
                          { color: AppTheme.colors.text, borderColor: AppTheme.colors.text }
                        ],
                      isCurrentRoute && { fontSize: scaledPixels(20) }
                    ]}
                  >
                    {title.toUpperCase()}
                  </Text>
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
                onPress={() => router.push(route)}
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
                    icon={icon as ComponentProps<typeof MaterialCommunityIcons>['name']}
                  />
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

  underline: {
    borderColor: AppTheme.colors.subtext,
    borderBottomWidth: scaledPixels(3),
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

export default HeaderContent;
