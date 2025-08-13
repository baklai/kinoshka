import { scaledPixels } from '@/hooks/useScaledPixels';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';

interface CustomPressableProps extends PressableProps {
  text: string;
  onSelect?: () => void;
  style?: ViewStyle;
}

const PressableButton = ({ text, onSelect, style, ...props }: CustomPressableProps) => {
  const isFocused = true;

  return (
    <Pressable
      {...props}
      style={[styles.watchButton, isFocused && styles.watchButtonFocused, style]}
      onPress={onSelect}
    >
      <Text style={[isFocused ? styles.watchButtonTextFocused : styles.watchButtonText]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  watchButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: scaledPixels(15),
    borderRadius: scaledPixels(5),
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  watchButtonFocused: {
    backgroundColor: '#fff'
  },
  watchButtonText: {
    color: '#fff',
    fontSize: scaledPixels(18),
    fontWeight: 'bold'
  },
  watchButtonTextFocused: {
    color: '#000',
    fontSize: scaledPixels(18),
    fontWeight: 'bold'
  }
});

export default PressableButton;
