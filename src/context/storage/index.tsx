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
};

const BOOKMARKS_KEY = 'bookmarks';
const HISTORY_KEY = 'history';
const MAX_HISTORY = 24;

const StorageContext = createContext<StorageContextType>({
  bookmarks: [],
  isBookmarked: () => false,
  toggleBookmark: async () => {},
  clearBookmarks: async () => {},
  loadHistory: async () => [],
  addToHistory: async () => {},
  clearHistory: async () => {}
});

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(BOOKMARKS_KEY)
      .then(raw => setBookmarks(raw ? JSON.parse(raw) : []))
      .catch(err => console.error('[StorageProvider] load bookmarks error:', err));
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

  const value = useMemo(
    () => ({
      bookmarks,
      isBookmarked,
      toggleBookmark,
      clearBookmarks,
      loadHistory,
      addToHistory,
      clearHistory
    }),
    [
      bookmarks,
      isBookmarked,
      toggleBookmark,
      clearBookmarks,
      loadHistory,
      addToHistory,
      clearHistory
    ]
  );

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage() {
  return useContext(StorageContext);
}
