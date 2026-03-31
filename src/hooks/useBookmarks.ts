import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { MovieProps } from '@/types/movie.type';

type BookmarkRow = Pick<MovieProps, 'source' | 'poster' | 'title'>;

export function useBookmarks() {
  const db = useSQLiteContext();
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const rows = await db.getAllAsync<BookmarkRow>('SELECT source, poster, title FROM bookmarks');
      setBookmarks(rows);
    } catch (error) {
      console.error('[useBookmarks] loadBookmarks error:', error);
    }
  }, [db]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const isBookmarked = useCallback(
    (source: string) => bookmarks.some(b => b.source === source),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (movie: BookmarkRow) => {
      try {
        const exists = bookmarks.some(b => b.source === movie.source);

        if (exists) {
          await db.runAsync('DELETE FROM bookmarks WHERE source = ?', [movie.source]);
          setBookmarks(prev => prev.filter(b => b.source !== movie.source));
        } else {
          await db.runAsync(
            'INSERT OR REPLACE INTO bookmarks (source, poster, title) VALUES (?, ?, ?)',
            [movie.source, movie.poster ?? null, movie.title]
          );
          setBookmarks(prev => [
            ...prev,
            { source: movie.source, poster: movie.poster ?? null, title: movie.title }
          ]);
        }
      } catch (error) {
        console.error('[useBookmarks] toggleBookmark error:', error);
      }
    },
    [db, bookmarks]
  );

  return { bookmarks, isBookmarked, toggleBookmark };
}
