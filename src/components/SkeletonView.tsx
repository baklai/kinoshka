import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, ViewProps } from 'react-native';

import { AppTheme } from '@/constants/ui.constant';

const { width } = Dimensions.get('window');

export const SkeletonView = ({ style }: ViewProps) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width]
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', '#27272750', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const { spacing, radius } = AppTheme;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181850',
    width: spacing(22.625),
    height: spacing(32.375),
    borderRadius: radius.sm,
    marginVertical: spacing(0.5),
    overflow: 'hidden'
  }
});
