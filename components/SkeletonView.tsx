import { scaledPixels } from '@/hooks/useScaledPixels';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const SkeletonView = () => {
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
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateX }]
          }
        ]}
      >
        <LinearGradient
          colors={['transparent', '#27272750', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181850',
    width: scaledPixels(181),
    height: scaledPixels(259),
    borderRadius: scaledPixels(6),
    marginVertical: scaledPixels(4)
  }
});

export default SkeletonView;
