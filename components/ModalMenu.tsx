import { router } from 'expo-router';
import React, { useContext, useMemo, useRef } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { AppTheme } from '@/constants/theme.constant';
import { AppContext } from '@/context';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { IconType } from '@/types/icons.type';
import { StyledIcon } from './StyledIcon';

interface ModalContentProps {
  visible: boolean;
  toggle: (value: boolean) => void;
}

interface NavMenuItem {
  icon?: IconType;
  title?: string;
  separator?: boolean;
  onPress?: () => void;
}

const ITEM_HEIGHT = 60;

export const ModalMenu = ({ visible, toggle }: ModalContentProps) => {
  const appContext = useContext(AppContext);
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
          icon: 'exit-to-app',
          title: 'Вихід',
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
        {item.separator ? (
          <View
            onFocus={() => {
              scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true
              });
            }}
            style={{
              height: scaledPixels(1),
              backgroundColor: AppTheme.colors.primary
            }}
          >
            <Text style={styles.text}>separator - separator - separator</Text>
          </View>
        ) : (
          <Pressable
            focusable
            onFocus={() => {
              scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true
              });
            }}
            onPress={() => {
              toggle(false);
              item?.onPress?.();
            }}
            style={({ focused, pressed }) => [styles.pressable]}
          >
            {item.icon && <StyledIcon color={AppTheme.colors.text} icon={item.icon} />}
            <Text style={styles.text}>{item.title}</Text>
          </Pressable>
        )}
      </Animated.View>
    );
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: scaledPixels(20),
        backgroundColor: AppTheme.colors.background
      }}
    >
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        statusBarTranslucent={true}
        onRequestClose={() => toggle(false)}
      >
        <View style={styles.container}>
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
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
