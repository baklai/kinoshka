import { router } from 'expo-router';
import React, { useCallback, useContext, useMemo, useRef } from 'react';
import {
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  TVFocusGuideView,
  Text,
  useWindowDimensions
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/ui.constant';
import { AppContext } from '@/context/app.context';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { IconType } from '@/types/icons.type';

export interface NavMenuItem {
  icon?: string;
  title?: string;
  separator?: boolean;
  onPress?: () => void;
}

const ITEM_HEIGHT = 60;

const GITHUB_REALEASE = process.env.EXPO_PUBLIC_GITHUB_REALEASE || '';

const AnimatedItem = React.memo(
  ({
    item,
    index,
    scrollY,
    onFocused
  }: {
    item: NavMenuItem;
    index: number;
    scrollY: ReturnType<typeof useSharedValue<number>>;
    onFocused: (index: number) => void;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const position = (index * ITEM_HEIGHT - scrollY.value) / ITEM_HEIGHT;
      const scale = interpolate(position, [-1, 0, 1], [0.9, 1, 0.9]);
      const opacity = interpolate(position, [-2, -1, 0, 1, 2], [0.1, 0.4, 1, 0.4, 0.1]);
      return { transform: [{ scale }], opacity };
    });

    return (
      <Animated.View style={[styles.item, animatedStyle]}>
        <Pressable
          focusable
          hasTVPreferredFocus={index === 0}
          onPress={item?.onPress}
          onFocus={() => onFocused(index)}
          style={({ focused }) => [
            styles.pressable,
            focused && { opacity: 0.85 },
            item.separator && { height: AppTheme.metrics.hairline, opacity: 0.3 }
          ]}
        >
          {item.icon && <StyledIcon color={AppTheme.colors.text} icon={item.icon as IconType} />}
          {item.title && <Text style={styles.text}>{item.title}</Text>}
        </Pressable>
      </Animated.View>
    );
  }
);

AnimatedItem.displayName = 'AnimatedItem';

export default function MenuScreen() {
  const appContext = useContext(AppContext);
  const { checkForUpdate } = useAppUpdate(GITHUB_REALEASE);
  const { height } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const paddingVertical = (height - ITEM_HEIGHT) / 2;

  const handleItemFocused = useCallback(
    (index: number) => {
      const itemCenter = paddingVertical + index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
      const targetOffset = itemCenter - height / 2;
      scrollRef.current?.scrollTo({ y: targetOffset, animated: true });
    },
    [height, paddingVertical]
  );

  const navMenuList: NavMenuItem[] = useMemo(() => {
    return [
      ...appContext.categories.map(item => ({
        title: item.title,
        onPress: () => {
          router.replace({
            pathname: '/',
            params: { title: item.title, source: item.source }
          });
        }
      })),
      { separator: true },
      {
        icon: 'magnify',
        title: 'Пошук',
        onPress: () => router.replace('/search')
      },
      {
        icon: 'history',
        title: 'Історія',
        onPress: () => router.replace('/history')
      },
      {
        icon: 'bookmark',
        title: 'Закладки',
        onPress: () => router.replace('/bookmarks')
      },
      {
        icon: 'cog-outline',
        title: 'Налаштування',
        onPress: () => router.replace('/options')
      },
      {
        icon: 'update',
        title: 'Перевірити оновлення',
        onPress: () => {
          router.back();
          checkForUpdate();
        }
      },
      {
        icon: 'information-outline',
        title: 'Про додаток',
        onPress: () => router.replace('/about')
      },
      {
        icon: 'exit-to-app',
        title: 'Вихід',
        onPress: () => {
          Alert.alert('Зачекай!', 'Ви впевнені, що хочете вийти?', [
            { text: 'Скасувати', onPress: () => null },
            {
              text: 'Так',
              onPress: () => {
                router.back();
                BackHandler.exitApp();
              }
            }
          ]);
        }
      }
    ];
  }, [appContext, checkForUpdate]);

  return (
    <TVFocusGuideView
      style={styles.container}
      trapFocusLeft
      trapFocusRight
      trapFocusDown
      trapFocusUp
      hasTVPreferredFocus
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical }}
        onScroll={e => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
      >
        {navMenuList.map((item: NavMenuItem, index: number) => (
          <AnimatedItem
            key={`nav-item-${index}`}
            item={item}
            index={index}
            scrollY={scrollY}
            onFocused={handleItemFocused}
          />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  );
}

const { spacing, radius, typography } = AppTheme;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pressable: {
    width: 300,
    height: ITEM_HEIGHT - 10,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing(0.75),
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: AppTheme.colors.text,
    textAlign: 'center',
    fontSize: typography.xl,
    fontWeight: '500'
  }
});
