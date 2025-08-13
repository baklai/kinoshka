import { SearchSvgIcon } from '@/components/StyledIcons';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchableButtonProps {
  onSearch?: (query: string) => void;
}

export default function SearchableButton({ onSearch }: SearchableButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const widthAnim = useRef(new Animated.Value(40)).current;

  const toggleSearch = () => {
    if (expanded) {
      Animated.timing(widthAnim, {
        toValue: 40,
        duration: 200,
        useNativeDriver: false
      }).start(() => setExpanded(false));
    } else {
      setExpanded(true);
      Animated.timing(widthAnim, {
        toValue: 200,
        duration: 200,
        useNativeDriver: false
      }).start();
    }
  };

  return (
    <Animated.View
      style={[styles.container, { width: widthAnim }, expanded && { backgroundColor: '#2a2a2a' }]}
    >
      {expanded ? (
        <View style={styles.inputWrapper}>
          <SearchSvgIcon />
          <TextInput
            style={styles.input}
            placeholder="Пошук..."
            placeholderTextColor="#ccc"
            value={query}
            onChangeText={text => {
              setQuery(text);
              onSearch?.(text);
            }}
            autoFocus
            onBlur={toggleSearch}
          />
        </View>
      ) : (
        <TouchableOpacity onPress={toggleSearch}>
          <SearchSvgIcon />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '60%',
    borderRadius: scaledPixels(8),
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: '#17171A',
    paddingVertical: scaledPixels(10),
    paddingHorizontal: scaledPixels(10)
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: scaledPixels(14),
    paddingHorizontal: scaledPixels(6)
  }
});
