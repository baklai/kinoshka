import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';

import { PLAYERS } from '@/constants/players.constant';
import { uakino } from '@/services/uakino.service';
import { MovieProps } from '@/types/movie.type';
import { PlayerType } from '@/types/player.type';
import { ServiceType } from '@/types/service.type';

type AppContextType = {
  release: string;
  service: ServiceType | null;
  player: PlayerType | null;
  setService: (key: string) => void;
  setPlayer: (key: string) => void;
  bookmarks: Pick<MovieProps, 'source' | 'poster' | 'title'>[];
  history: Pick<MovieProps, 'source' | 'poster' | 'title'>[];
  search: string[];
  isBookmarked: (source: string) => boolean;
  toggleBookmark: (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => void;
  addHistory: (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) => void;
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearBookmarks: () => void;
  clearHistory: () => void;
  clearSearch: () => void;
  bookmarksLength: () => number;
};

const RELEASE = process.env.EXPO_PUBLIC_GITHUB_RELEASE || '';

export const SERVICES: Record<string, ServiceType> = {
  uakino
};

const SERVICE_KEY = 'service';
const PLAYER_KEY = 'player';
const BOOKMARK_KEY = 'bookmark';
const HISTORY_KEY = 'history';
const SEARCH_KEY = 'search';
const MAX_HISTORY = 24;
const MAX_SEARCH = 8;

export const AppContext = createContext<AppContextType>({
  release: '',
  service: null,
  player: null,
  setService: () => {},
  setPlayer: () => {},
  bookmarks: [],
  history: [],
  search: [],
  isBookmarked: () => false,
  toggleBookmark: () => {},
  addHistory: () => {},
  addSearch: () => {},
  removeSearch: () => {},
  clearBookmarks: () => {},
  clearHistory: () => {},
  clearSearch: () => {},
  bookmarksLength: () => 0
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [service, setServiceState] = useState<ServiceType | null>(null);
  const [player, setPlayerState] = useState<PlayerType | null>(null);
  const [bookmarks, setBookmarks] = useState<Pick<MovieProps, 'source' | 'poster' | 'title'>[]>([]);
  const [history, setHistory] = useState<Pick<MovieProps, 'source' | 'poster' | 'title'>[]>([]);
  const [search, setSearch] = useState<string[]>([]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(SERVICE_KEY),
      AsyncStorage.getItem(PLAYER_KEY),
      AsyncStorage.getItem(BOOKMARK_KEY),
      AsyncStorage.getItem(HISTORY_KEY),
      AsyncStorage.getItem(SEARCH_KEY)
    ]).then(([v, p, b, h, s]) => {
      setServiceState(v ? SERVICES[v] : null);
      setPlayerState(p ? PLAYERS[p] : null);
      setBookmarks(b ? JSON.parse(b) : []);
      setHistory(h ? JSON.parse(h) : []);
      setSearch(s ? JSON.parse(s) : []);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (service?.key) {
      AsyncStorage.setItem(SERVICE_KEY, service.key).catch(console.error);
    }
  }, [service, ready]);

  useEffect(() => {
    if (!ready) return;
    if (player?.key) {
      AsyncStorage.setItem(PLAYER_KEY, player.key).catch(console.error);
    }
  }, [player, ready]);

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

  const setService = useCallback((key: string) => {
    setServiceState(SERVICES[key] ?? null);
  }, []);

  const setPlayer = useCallback((key: string) => {
    setPlayerState(PLAYERS[key] ?? null);
  }, []);

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
  const bookmarksLength = useCallback(() => bookmarks.length, [bookmarks]);

  return (
    <AppContext.Provider
      value={{
        release: RELEASE,
        service,
        player,
        setService,
        setPlayer,
        bookmarks,
        history,
        search,
        isBookmarked,
        toggleBookmark,
        addHistory,
        addSearch,
        removeSearch,
        clearBookmarks,
        clearHistory,
        clearSearch,
        bookmarksLength
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
