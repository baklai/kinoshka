import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { IconType } from '@/types/icons.type';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface navTab {
  icon: IconType;
  title?: string;
  route: string;
}

const NAV_TABS: navTab[] = [
  {
    route: 'search',
    icon: 'magnify',
    title: 'Пошук'
  },
  {
    route: 'history',
    icon: 'history',
    title: 'Історія'
  },
  {
    route: 'menu',
    icon: 'menu',
    title: 'Меню'
  },
  {
    route: 'bookmarks',
    icon: 'bookmark',
    title: 'Закладки'
  },
  {
    route: 'options',
    icon: 'cog-outline',
    title: 'Налаштування'
  }
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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  tab: {
    flex: 1,
    paddingVertical: scaledPixels(12),
    alignItems: 'center'
  },
  tabText: {
    fontSize: scaledPixels(14),
    fontWeight: 'bold',
    color: AppTheme.colors.subtext,
    marginTop: 2
  }
});
