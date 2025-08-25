import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface SpeechButtonProps {
  onPress?: () => void;
}

export default function SpeechButton({ onPress }: SpeechButtonProps) {
  return (
    <Pressable
      focusable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.7 }]}
    >
      {({ focused }) => (
        <StyledIcon
          size="large"
          icon="microphone"
          color={focused ? AppTheme.colors.primary : AppTheme.colors.text}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: '50%',
    backgroundColor: AppTheme.colors.card
  }
});
