import { MoviesFlatList } from '@/components/MoviesFlatList';
import { AppContext } from '@/context';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, TVFocusGuideView, View } from 'react-native';

export default function IndexScreen() {
  const appContext = useContext(AppContext);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const offsetsRef = useRef<number[]>([]);

  const rememberOffset = useCallback(
    (idx: number) => (e: LayoutChangeEvent) => {
      offsetsRef.current[idx] = e.nativeEvent.layout.y;
    },
    []
  );

  const handleFocus = useCallback((idx: number) => {
    setFocusedIndex(idx);
    const y = offsetsRef.current[idx] ?? 0;
    const top = Math.max(0, y);
    scrollViewRef.current?.scrollTo({ y: top, animated: true });
  }, []);

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {appContext?.baseUrl &&
          appContext.categories.map(({ source, title, limit }, idx) => {
            const isFocused = focusedIndex === idx;
            return (
              <View
                key={`movie-flat-list-${idx}`}
                onLayout={rememberOffset(idx)}
                hasTVPreferredFocus={idx === 0}
                onFocus={() => handleFocus(idx)}
                onBlur={() => setFocusedIndex(null)}
              >
                <MoviesFlatList title={title} source={source} limit={limit} focused={isFocused} />
              </View>
            );
          })}
      </ScrollView>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
