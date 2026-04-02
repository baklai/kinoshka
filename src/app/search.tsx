import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { MoviesFlatList } from '@/components/MoviesFlatList';
import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/ui.constant';
import { useStorage } from '@/context/storage';
import { useAppContext } from '@/hooks/useAppContext';
import { IconType } from '@/types/icons.type';
import { MovieProps } from '@/types/movie.type';

const MIN_QUERY_LENGTH = 3;

const MinCharsHint = ({ current }: { current: number }) => {
  const remaining = MIN_QUERY_LENGTH - current;
  const progress = (current / MIN_QUERY_LENGTH) * 100;

  return (
    <View style={styles.hintBlock}>
      <View style={styles.hintRow}>
        <StyledIcon
          icon={'information-outline' as IconType}
          size="normal"
          color={AppTheme.colors.subtext}
        />
        <Text style={styles.hintText}>
          Введіть ще {remaining} {remaining === 1 ? 'символ' : 'символи'}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>
    </View>
  );
};

const CATEGORY_CHIPS = [
  { label: 'Фільми', query: 'фільм' },
  { label: 'Серіали', query: 'серіал' },
  { label: 'Мультфільми', query: 'мультфільм' },
  { label: 'Аніме', query: 'аніме' },
  { label: 'Документальні', query: 'документальний' }
];

type CategoryChipsProps = {
  onSelect: (query: string) => void;
};

const CategoryChips = ({ onSelect }: CategoryChipsProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>Популярні категорії</Text>
    <View style={styles.chipsRow}>
      {CATEGORY_CHIPS.map(chip => (
        <Pressable
          key={chip.query}
          focusable
          onPress={() => onSelect(chip.query)}
          style={({ focused, pressed }) => [
            styles.chip,
            focused && styles.chipFocused,
            pressed && { opacity: 0.7 }
          ]}
        >
          {({ focused }) => (
            <Text style={[styles.chipText, focused && styles.chipTextFocused]}>{chip.label}</Text>
          )}
        </Pressable>
      ))}
    </View>
  </View>
);

type RecentSearchesProps = {
  searches: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
};

const RecentSearches = ({ searches, onSelect, onRemove }: RecentSearchesProps) => {
  if (searches.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Недавні пошуки</Text>
      {searches.map(query => (
        <View key={query} style={styles.recentRow}>
          <Pressable
            focusable
            onPress={() => onSelect(query)}
            style={({ focused, pressed }) => [
              styles.recentItem,
              focused && styles.recentItemFocused,
              pressed && { opacity: 0.7 }
            ]}
          >
            <StyledIcon
              icon={'history' as IconType}
              size="normal"
              color={AppTheme.colors.subtext}
            />
            <Text style={styles.recentText} numberOfLines={1}>
              {query}
            </Text>
          </Pressable>
          <Pressable
            focusable
            onPress={() => onRemove(query)}
            style={({ focused, pressed }) => [
              styles.removeButton,
              focused && styles.removeButtonFocused,
              pressed && { opacity: 0.7 }
            ]}
          >
            <StyledIcon icon={'close' as IconType} size="small" color={AppTheme.colors.subtext} />
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const ResultsCount = ({ count }: { count: number }) => (
  <Text style={styles.resultsCount}>{count > 0 ? `Знайдено: ${count}` : 'Нічого не знайдено'}</Text>
);

export default function SearchScreen() {
  const [query, setQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState(true);
  const [resultsCount, setResultsCount] = useState<number | null>(null);

  const { baseUrl, searchUrl, searchMovieCards } = useAppContext();
  const { recentSearches, addRecentSearch, removeRecentSearch } = useStorage();

  const inputRef = useRef<TextInput>(null);

  const handleResults = useCallback(
    (results: MovieProps[]) => {
      setResultsCount(results.length);
      if (results.length > 0) {
        addRecentSearch(query);
      }
    },
    [query, addRecentSearch]
  );

  const handleChipSelect = useCallback((q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  }, []);

  const fetchData = useCallback(
    async (page: number): Promise<MovieProps[]> => {
      if (query.length < MIN_QUERY_LENGTH) return [];
      if (page > 1) return [];
      try {
        const results = await searchMovieCards(baseUrl, searchUrl, query);
        handleResults(results);
        return results;
      } catch (error) {
        console.error('Fetch error:', error);
        return [];
      }
    },
    [query, baseUrl, searchUrl, searchMovieCards, handleResults]
  );

  useEffect(() => {
    setResultsCount(null);
  }, [query]);

  const showSuggestions = query.length === 0;
  const showMinHint = query.length > 0 && query.length < MIN_QUERY_LENGTH;
  const showResults = query.length >= MIN_QUERY_LENGTH;

  return (
    <View style={styles.container} hasTVPreferredFocus>
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
          <StyledIcon icon="magnify" size="normal" color={AppTheme.colors.subtext} />
          <TextInput
            ref={inputRef}
            autoFocus
            autoCorrect={false}
            caretHidden
            inputMode="search"
            enterKeyHint="search"
            placeholderTextColor={AppTheme.colors.subtext}
            cursorColor={AppTheme.colors.primary}
            style={styles.searchInput}
            onChangeText={setQuery}
            value={query}
            placeholder="Пошук відео..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {query.length > 0 && (
            <Pressable
              focusable
              onPress={() => setQuery('')}
              style={({ focused, pressed }) => [
                styles.clearButton,
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

      {(showSuggestions || showMinHint) && (
        <ScrollView
          style={styles.suggestionsContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {showMinHint && <MinCharsHint current={query.length} />}

          {showSuggestions && <CategoryChips onSelect={handleChipSelect} />}

          <RecentSearches
            searches={recentSearches}
            onSelect={handleChipSelect}
            onRemove={removeRecentSearch}
          />
        </ScrollView>
      )}

      {showResults && (
        <View style={styles.resultsContainer}>
          {resultsCount !== null && <ResultsCount count={resultsCount} />}
          <MoviesFlatList onFetch={fetchData} key={query} />
        </View>
      )}
    </View>
  );
}

const { spacing, typography, radius } = AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing(1.25),
    paddingBottom: spacing(1.5)
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing(6),
    paddingHorizontal: spacing(2.5),
    backgroundColor: AppTheme.colors.card,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  searchBarFocused: {
    borderColor: AppTheme.colors.primary
  },
  searchInput: {
    flex: 1,
    marginHorizontal: spacing(0.5),
    color: AppTheme.colors.text,
    fontSize: typography.lg,
    paddingVertical: spacing(1.25)
  },
  clearButton: {
    width: spacing(4),
    height: spacing(4),
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  suggestionsContainer: {
    flex: 1,
    paddingTop: spacing(0.5)
  },
  section: {
    marginBottom: spacing(2.5)
  },
  sectionLabel: {
    fontSize: typography.sm,
    color: AppTheme.colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing(1)
  },
  hintBlock: {
    marginBottom: spacing(2.5)
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.75),
    marginBottom: spacing(0.75)
  },
  hintText: {
    fontSize: typography.md,
    color: AppTheme.colors.subtext
  },
  progressTrack: {
    height: 2,
    backgroundColor: AppTheme.colors.border,
    borderRadius: 1
  },
  progressFill: {
    height: 2,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 1
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1)
  },
  chip: {
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface
  },
  chipFocused: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.muted
  },
  chipText: {
    fontSize: typography.md,
    color: AppTheme.colors.subtext
  },
  chipTextFocused: {
    color: AppTheme.colors.text
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border
  },
  recentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(0.5),
    borderRadius: radius.sm
  },
  recentItemFocused: {
    backgroundColor: AppTheme.colors.muted
  },
  recentText: {
    flex: 1,
    fontSize: typography.lg,
    color: AppTheme.colors.text
  },
  removeButton: {
    width: spacing(4.5),
    height: spacing(4.5),
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing(0.5)
  },
  removeButtonFocused: {
    backgroundColor: AppTheme.colors.muted
  },
  resultsContainer: {
    flex: 1
  },
  resultsCount: {
    fontSize: typography.sm,
    color: AppTheme.colors.subtext,
    marginBottom: spacing(1)
  }
});
