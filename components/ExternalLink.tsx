import { Link } from 'expo-router';
import React, { type ComponentProps } from 'react';
import { Linking, Pressable } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...props }: Props) {
  // On TV, use a Pressable (which handles focus navigation) instead of the Link component
  return (
    <Pressable
      onPress={() => Linking.openURL(href).catch(reason => alert(`${reason}`))}
      style={({ pressed, focused }) => ({
        opacity: pressed || focused ? 0.6 : 1.0
      })}
    >
      {props.children}
    </Pressable>
  );
}
