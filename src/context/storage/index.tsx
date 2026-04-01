import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { MovieProps } from '@/types/movie.type';

export type BookmarkRow = Pick<MovieProps, 'source' | 'poster' | 'title'>;
export type HistoryRow = Pick<MovieProps, 'source' | 'poster' | 'title'> & { viewed_at: number };

type StorageContextType = {
  bookmarks: BookmarkRow[];
  isBookmarked: (source: string) => boolean;
  toggleBookmark: (movie: BookmarkRow) => Promise<void>;
  clearBookmarks: () => Promise<void>;

  loadHistory: () => Promise<HistoryRow[]>;
  addToHistory: (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => Promise<void>;
  clearHistory: () => Promise<void>;

  recentSearches: string[];
  addRecentSearch: (query: string) => Promise<void>;
  removeRecentSearch: (query: string) => Promise<void>;
  clearRecentSearches: () => Promise<void>;
};

const BOOKMARKS_KEY = 'bookmarks';
const HISTORY_KEY = 'history';
const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_HISTORY = 24;
const MAX_RECENT_SEARCHES = 8;

const StorageContext = createContext<StorageContextType>({
  bookmarks: [],
  isBookmarked: () => false,
  toggleBookmark: async () => {},
  clearBookmarks: async () => {},
  loadHistory: async () => [],
  addToHistory: async () => {},
  clearHistory: async () => {},
  recentSearches: [],
  addRecentSearch: async () => {},
  removeRecentSearch: async () => {},
  clearRecentSearches: async () => {}
});

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(BOOKMARKS_KEY)
      .then(raw => setBookmarks(raw ? JSON.parse(raw) : []))
      .catch(err => console.error('[StorageProvider] load bookmarks error:', err));

    AsyncStorage.getItem(RECENT_SEARCHES_KEY)
      .then(raw => setRecentSearches(raw ? JSON.parse(raw) : []))
      .catch(err => console.error('[StorageProvider] load recent searches error:', err));
  }, []);

  const isBookmarked = useCallback(
    (source: string) => bookmarks.some(b => b.source === source),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (movie: BookmarkRow) => {
      try {
        const exists = bookmarks.some(b => b.source === movie.source);
        const next = exists
          ? bookmarks.filter(b => b.source !== movie.source)
          : [
              ...bookmarks,
              { source: movie.source, poster: movie.poster ?? null, title: movie.title }
            ];
        setBookmarks(next);
        await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('[StorageProvider] toggleBookmark error:', err);
      }
    },
    [bookmarks]
  );

  const clearBookmarks = useCallback(async () => {
    try {
      setBookmarks([]);
      await AsyncStorage.removeItem(BOOKMARKS_KEY);
    } catch (err) {
      console.error('[StorageProvider] clearBookmarks error:', err);
    }
  }, []);

  const loadHistory = useCallback(async (): Promise<HistoryRow[]> => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('[StorageProvider] loadHistory error:', err);
      return [];
    }
  }, []);

  const addToHistory = useCallback(
    async (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        const history: HistoryRow[] = raw ? JSON.parse(raw) : [];
        const next: HistoryRow[] = [
          {
            source: movie.source,
            poster: movie.poster ?? null,
            title: movie.title,
            viewed_at: Date.now()
          },
          ...history.filter(h => h.source !== movie.source)
        ].slice(0, MAX_HISTORY);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('[StorageProvider] addToHistory error:', err);
      }
    },
    []
  );

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (err) {
      console.error('[StorageProvider] clearHistory error:', err);
    }
  }, []);

  const addRecentSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      try {
        const next = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(
          0,
          MAX_RECENT_SEARCHES
        );
        setRecentSearches(next);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('[StorageProvider] addRecentSearch error:', err);
      }
    },
    [recentSearches]
  );

  const removeRecentSearch = useCallback(
    async (query: string) => {
      try {
        const next = recentSearches.filter(s => s !== query);
        setRecentSearches(next);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('[StorageProvider] removeRecentSearch error:', err);
      }
    },
    [recentSearches]
  );

  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error('[StorageProvider] clearRecentSearches error:', err);
    }
  }, []);

  const value = useMemo(
    () => ({
      bookmarks,
      isBookmarked,
      toggleBookmark,
      clearBookmarks,
      loadHistory,
      addToHistory,
      clearHistory,
      recentSearches,
      addRecentSearch,
      removeRecentSearch,
      clearRecentSearches
    }),
    [
      bookmarks,
      isBookmarked,
      toggleBookmark,
      clearBookmarks,
      loadHistory,
      addToHistory,
      clearHistory,
      recentSearches,
      addRecentSearch,
      removeRecentSearch,
      clearRecentSearches
    ]
  );

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage() {
  return useContext(StorageContext);
}
