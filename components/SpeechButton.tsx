import { StyledIcon } from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface SpeechButtonProps {
  onPress?: () => void;
}

export default function SpeechButton({ onPress }: SpeechButtonProps) {
  return (
    <Pressable
      focusable
      onPress={onPress}
      style={({ focused, pressed }) => [
        styles.button,
        focused && { backgroundColor: '#272727' },
        pressed && { opacity: 0.7 }
      ]}
    >
      <View style={styles.icon}>
        <StyledIcon size="large" name="microphone" color="#666" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: scaledPixels(48 / 2),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scaledPixels(4)
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: scaledPixels(48 / 2),
    backgroundColor: '#272727'
  }
});
