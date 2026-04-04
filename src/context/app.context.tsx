import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import { DEFAULT_PLAYER } from '@/constants/players.constant';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { DEFAULT_CATEGORY, DEFAULT_SERVICE } from '@/services';
import { MovieProps } from '@/types/movie.type';

type AppContextType = {
  release: string;
  service: string;
  player: string;
  category: string;

  bookmarks: Pick<MovieProps, 'source' | 'poster' | 'title'>[];
  history: Pick<MovieProps, 'source' | 'poster' | 'title'>[];
  search: string[];

  setService: (key: string) => void;
  setPlayer: (key: string) => void;
  setCategory: (key: string) => void;

  isBookmarked: (source: string) => boolean;
  toggleBookmark: (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => void;

  addHistory: (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => void;

  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;

  clearBookmarks: () => void;
  clearHistory: () => void;
  clearSearch: () => void;

  checkForUpdate: () => void;
};

const RELEASE = process.env.EXPO_PUBLIC_GITHUB_RELEASE || '';

const PLAYER_KEY = 'player';
const CATEGORY_KEY = 'category';
const SERVICE_KEY = 'service';
const BOOKMARK_KEY = 'bookmark';
const HISTORY_KEY = 'history';
const SEARCH_KEY = 'search';
const MAX_HISTORY = 24;
const MAX_SEARCH = 8;

export const AppContext = createContext<AppContextType>({
  release: '',
  category: DEFAULT_CATEGORY,
  service: DEFAULT_SERVICE,
  player: DEFAULT_PLAYER,
  bookmarks: [],
  history: [],
  search: [],
  setService: () => {},
  setPlayer: () => {},
  setCategory: () => {},
  isBookmarked: () => false,
  toggleBookmark: () => {},
  addHistory: () => {},
  addSearch: () => {},
  removeSearch: () => {},
  clearBookmarks: () => {},
  clearHistory: () => {},
  clearSearch: () => {},
  checkForUpdate: () => {}
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { checkForUpdate } = useAppUpdate(RELEASE);
  const [service, setService] = useState<string>(DEFAULT_SERVICE);
  const [player, setPlayer] = useState<string>(DEFAULT_PLAYER);
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [bookmarks, setBookmarks] = useState<Pick<MovieProps, 'source' | 'poster' | 'title'>[]>([]);
  const [history, setHistory] = useState<Pick<MovieProps, 'source' | 'poster' | 'title'>[]>([]);
  const [search, setSearch] = useState<string[]>([]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(SERVICE_KEY),
      AsyncStorage.getItem(CATEGORY_KEY),
      AsyncStorage.getItem(PLAYER_KEY),
      AsyncStorage.getItem(BOOKMARK_KEY),
      AsyncStorage.getItem(HISTORY_KEY),
      AsyncStorage.getItem(SEARCH_KEY)
    ]).then(([aService, aCategory, aPlayer, aBookmarks, aHistory, aSearch]) => {
      setService(aService ? aService : DEFAULT_SERVICE);
      setCategory(aCategory ? aCategory : DEFAULT_CATEGORY);
      setPlayer(aPlayer ? aPlayer : DEFAULT_PLAYER);
      setBookmarks(aBookmarks ? JSON.parse(aBookmarks) : []);
      setHistory(aHistory ? JSON.parse(aHistory) : []);
      setSearch(aSearch ? JSON.parse(aSearch) : []);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(SERVICE_KEY, service).catch(console.error);
  }, [service, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(PLAYER_KEY, player).catch(console.error);
  }, [player, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(CATEGORY_KEY, category).catch(console.error);
  }, [category, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks)).catch(console.error);
  }, [bookmarks, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history)).catch(console.error);
  }, [history, ready]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(SEARCH_KEY, JSON.stringify(search)).catch(console.error);
  }, [search, ready]);

  const isBookmarked = useCallback(
    (source: string) => bookmarks.some(b => b.source === source),
    [bookmarks]
  );

  const toggleBookmark = useCallback((movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => {
    setBookmarks(prev =>
      prev.some(b => b.source === movie.source)
        ? prev.filter(b => b.source !== movie.source)
        : [...prev, { source: movie.source, poster: movie.poster ?? null, title: movie.title }]
    );
  }, []);

  const addHistory = useCallback((movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => {
    setHistory(prev =>
      [
        { ...movie, poster: movie.poster ?? null },
        ...prev.filter(h => h.source !== movie.source)
      ].slice(0, MAX_HISTORY)
    );
  }, []);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearch(prev => [trimmed, ...prev.filter(s => s !== trimmed)].slice(0, MAX_SEARCH));
  }, []);

  const removeSearch = useCallback(
    async (query: string) => {
      try {
        const next = search.filter(s => s !== query);
        setSearch(next);
        await AsyncStorage.setItem(SEARCH_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('[AppProvider] removeSearch error:', err);
      }
    },
    [search]
  );

  const clearBookmarks = useCallback(() => setBookmarks([]), []);
  const clearHistory = useCallback(() => setHistory([]), []);
  const clearSearch = useCallback(() => setSearch([]), []);

  return (
    <AppContext.Provider
      value={{
        release: RELEASE,
        service,
        player,
        category,
        bookmarks,
        history,
        search,
        setService,
        setPlayer,
        setCategory,
        isBookmarked,
        toggleBookmark,
        addHistory,
        addSearch,
        removeSearch,
        clearBookmarks,
        clearHistory,
        clearSearch,
        checkForUpdate
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
