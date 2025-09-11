import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { AppContext } from '@/context';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { IconType } from '@/types/icons.type';
import { router } from 'expo-router';
import React, { useContext, useMemo, useRef } from 'react';
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

interface NavMenuItem {
  icon?: IconType;
  title?: string;
  separator?: boolean;
  onPress?: () => void;
}

const ITEM_HEIGHT = 60;

export default function ModalMenu() {
  const appContext = useContext(AppContext);
  const { startUpdateCheck } = useAutoUpdate();
  const { height } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const navMenuList = useMemo(() => {
    return [
      ...appContext.categories.map(item => {
        return {
          title: item.title,
          onPress: () => {
            router.push({
              pathname: '/',
              params: { title: item.title, source: item.source }
            });
          }
        };
      }),
      ...[
        { separator: true },
        {
          icon: 'magnify',
          title: 'Пошук',
          onPress: () => router.push('/search')
        },
        {
          icon: 'history',
          title: 'Історія',
          onPress: () => router.push('/history')
        },
        {
          icon: 'bookmark',
          title: 'Закладки',
          onPress: () => router.push('/bookmarks')
        },
        {
          icon: 'cog-outline',
          title: 'Налаштування',
          onPress: () => router.push('/options')
        },
        {
          icon: 'update',
          title: 'Перевірити оновлення',
          onPress: () => startUpdateCheck()
        },
        {
          icon: 'exit-to-app',
          title: 'Вихід',
          onPress: () => {
            Alert.alert('Зачекай!', 'Ви впевнені, що хочете вийти?', [
              {
                text: 'Скасувати',
                onPress: () => null
              },
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
      ]
    ];
  }, [appContext]);

  const AnimatedItem = React.memo(({ item, index }: { item: NavMenuItem; index: number }) => {
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
          onFocus={() => {
            scrollRef.current?.scrollTo({
              y: index * ITEM_HEIGHT,
              animated: true
            });
          }}
          onPress={item?.onPress}
          style={({ focused }) => [
            styles.pressable,
            focused && { opacity: 0.85 },
            item.separator && { height: scaledPixels(1), opacity: 0.3 }
          ]}
        >
          {item.icon && <StyledIcon color={AppTheme.colors.text} icon={item.icon} />}
          {item.title && <Text style={styles.text}>{item.title}</Text>}
        </Pressable>
      </Animated.View>
    );
  });

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
        contentContainerStyle={{
          paddingVertical: (height - ITEM_HEIGHT) / 2
        }}
        onScroll={e => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
      >
        {navMenuList.map((item: any, index: number) => (
          <AnimatedItem key={`nav-item-${index}`} item={item} index={index} />
        ))}
      </ScrollView>
    </TVFocusGuideView>
  );
}

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
    borderRadius: 12,
    flexDirection: 'row',
    gap: scaledPixels(6),
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: AppTheme.colors.text,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500'
  }
});
