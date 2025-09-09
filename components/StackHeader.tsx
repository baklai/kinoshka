import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

interface HeaderContentProps extends ViewProps {}

export const StackHeader = (props: HeaderContentProps) => {
  const router = useRouter();

  return (
    <View style={[styles.container, props.style]} hasTVPreferredFocus={false}>
      <View style={styles.section}>
        <Pressable
          onPress={() => router.push('/menu')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.primary },
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
          onPress={() => router.push('/search')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.primary },
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
          onPress={() => router.push('/history')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.primary },
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
          onPress={() => router.push('/bookmarks')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.primary },
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
          onPress={() => router.push('/options')}
          style={({ focused, pressed }) => [
            styles.pressableIcon,
            focused && { backgroundColor: AppTheme.colors.primary },
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
