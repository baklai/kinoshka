import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const animation = [0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0, 0.1, 0.2];

export const StyledLoader = () => {
  const animatedValues = useRef(animation.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animatedValues.forEach((value, index) => {
      const delay = animation[index] * 1000;
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 455,
            delay: delay,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 910,
            useNativeDriver: true
          })
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.spinGrid}>
        {animatedValues.map((value, index) => {
          const scale = value.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          });
          return (
            <Animated.View
              key={`cube-${index}`}
              style={[styles.spinGridCube, { transform: [{ scale: scale }] }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinGrid: {
    width: scaledPixels(120),
    height: scaledPixels(120),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinGridCube: {
    width: '33.33%',
    height: '33.33%',
    backgroundColor: AppTheme.colors.primary
  }
});
