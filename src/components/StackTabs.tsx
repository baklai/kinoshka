import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { IconType } from '@/types/icons.type';

type RouteType = '/search' | '/history' | '/menu' | '/bookmarks' | '/options';

interface NavTab {
  icon: IconType;
  title?: string;
  route: RouteType;
}

const NAV_TABS: NavTab[] = [
  { route: '/search', icon: 'magnify', title: 'Пошук' },
  { route: '/history', icon: 'history', title: 'Історія' },
  { route: '/menu', icon: 'menu', title: 'Меню' },
  { route: '/bookmarks', icon: 'bookmark', title: 'Закладки' },
  { route: '/options', icon: 'cog-outline', title: 'Налаштування' }
];

export const StackTabs = () => {
  return (
    <View style={styles.tabBar}>
      {NAV_TABS.map(({ route, icon, title }) => (
        <Pressable style={styles.tab} onPress={() => router.push(route)} key={route}>
          <StyledIcon size="large" color={AppTheme.colors.subtext} icon={icon} />
          {title && <Text style={styles.tabText}>{title}</Text>}
        </Pressable>
      ))}
    </View>
  );
};

const { spacing, typography } = AppTheme;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  tab: {
    flex: 1,
    paddingVertical: spacing(1.5),
    alignItems: 'center'
  },
  tabText: {
    fontSize: typography.sm,
    fontWeight: 'bold',
    color: AppTheme.colors.subtext,
    marginTop: 2
  }
});
