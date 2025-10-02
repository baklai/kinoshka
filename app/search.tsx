import { MoviesFlatList } from '@/components/MoviesFlatList';
import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { scaledPixels } from '@/hooks/useScaledPixels';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function SearchScreen() {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState(true);
  const { baseUrl, searchUrl, searchMovieCards } = useAppContext();

  const fetchData = useCallback(
    async (page: number) => {
      if (query.length < 3) return [];
      try {
        return await searchMovieCards(baseUrl, searchUrl, query);
      } catch (error) {
        console.error('Fetch error:', error);
        return [];
      }
    },
    [query, baseUrl, searchMovieCards]
  );

  return (
    <View style={styles.container} hasTVPreferredFocus>
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchSectionInput,
            isFocused && { borderWidth: scaledPixels(3), borderColor: AppTheme.colors.primary }
          ]}
        >
          <StyledIcon icon="magnify" size="normal" color={AppTheme.colors.subtext} />
          <TextInput
            autoFocus
            autoCorrect
            caretHidden
            inputMode="search"
            enterKeyHint="search"
            placeholderTextColor={AppTheme.colors.subtext}
            cursorColor={AppTheme.colors.primary}
            style={styles.searchSectionInputText}
            onChangeText={setQuery}
            value={query}
            placeholder="Пошук відео..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              style={({ focused, pressed }) => [
                {
                  aspectRatio: 1,

                  width: scaledPixels(32),
                  height: scaledPixels(32),
                  borderRadius: '50%',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                focused && { backgroundColor: AppTheme.colors.muted },
                pressed && { opacity: 0.7 }
              ]}
            >
              {({ focused }) => (
                <StyledIcon
                  size="small"
                  color={focused ? AppTheme.colors.text : AppTheme.colors.subtext}
                  icon="close"
                />
              )}
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.container}>
        <MoviesFlatList onFetch={fetchData} key={query} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: scaledPixels(12),
    marginVertical: scaledPixels(10)
  },
  searchSectionInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scaledPixels(48),
    marginLeft: scaledPixels(10),
    paddingHorizontal: scaledPixels(20),
    backgroundColor: AppTheme.colors.card
  },
  searchSectionInputText: {
    flex: 1,
    marginHorizontal: scaledPixels(4),
    color: AppTheme.colors.text,
    fontSize: scaledPixels(18)
  }
});
