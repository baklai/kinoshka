import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
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
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
    >
      {({ focused }) => (
        <View style={styles.icon}>
          <StyledIcon
            size="large"
            name="microphone"
            color={focused ? AppTheme.colors.primary : AppTheme.colors.text}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: scaledPixels(48 / 2),
    marginHorizontal: scaledPixels(4)
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaledPixels(48),
    height: scaledPixels(48),
    borderRadius: scaledPixels(48 / 2),
    backgroundColor: AppTheme.colors.card
  }
});
