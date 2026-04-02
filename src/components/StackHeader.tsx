import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/ui.constant';

type HeaderContentProps = ViewProps;

export const StackHeader = (props: HeaderContentProps) => {
  const router = useRouter();

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.section}>
        <Pressable
          focusable
          hasTVPreferredFocus
          onPress={() => router.push('/menu')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.muted },
            pressed && { opacity: 0.7 }
          ]}
        >
          {({ focused }) => (
            <StyledIcon
              size="large"
              color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
              icon="menu"
            />
          )}
        </Pressable>
      </View>

      <View style={styles.section}>
        <Pressable
          focusable
          onPress={() => router.push('/search')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.muted },
            pressed && { opacity: 0.7 }
          ]}
        >
          {({ focused }) => (
            <StyledIcon
              size="large"
              color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
              icon="magnify"
            />
          )}
        </Pressable>

        <Pressable
          focusable
          onPress={() => router.push('/history')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.muted },
            pressed && { opacity: 0.7 }
          ]}
        >
          {({ focused }) => (
            <StyledIcon
              size="large"
              color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
              icon="history"
            />
          )}
        </Pressable>

        <Pressable
          focusable
          onPress={() => router.push('/bookmarks')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.muted },
            pressed && { opacity: 0.7 }
          ]}
        >
          {({ focused }) => (
            <StyledIcon
              size="large"
              color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
              icon="bookmark"
            />
          )}
        </Pressable>

        <Pressable
          focusable
          onPress={() => router.push('/options')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.muted },
            pressed && { opacity: 0.7 }
          ]}
        >
          {({ focused }) => (
            <StyledIcon
              size="large"
              color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
              icon="cog-outline"
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const { spacing, radius } = AppTheme;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.colors.background
  },
  section: {
    gap: spacing(2.5),
    flexDirection: 'row',
    alignItems: 'center'
  },
  pressableIcon: {
    aspectRatio: 1,
    width: spacing(6),
    height: spacing(6),
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
