import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { MovieProps } from '@/types/movie.type';

type HistoryRow = Pick<MovieProps, 'source' | 'poster' | 'title'>;

const MAX_HISTORY_LENGTH = 24;

export function useHistory() {
  const db = useSQLiteContext();

  const addToHistory = useCallback(
    async (movie: HistoryRow) => {
      try {
        await db.runAsync(
          `INSERT INTO history (source, poster, title, viewed_at)
           VALUES (?, ?, ?, strftime('%s','now'))
           ON CONFLICT(source) DO UPDATE SET
             poster    = excluded.poster,
             title     = excluded.title,
             viewed_at = excluded.viewed_at`,
          [movie.source, movie.poster ?? null, movie.title]
        );

        await db.runAsync(
          `DELETE FROM history WHERE source NOT IN (
             SELECT source FROM history ORDER BY viewed_at DESC LIMIT ?
           )`,
          [MAX_HISTORY_LENGTH]
        );
      } catch (error) {
        console.error('[useHistory] addToHistory error:', error);
      }
    },
    [db]
  );

  const loadHistory = useCallback(async (): Promise<HistoryRow[]> => {
    try {
      return await db.getAllAsync<HistoryRow>(
        'SELECT source, poster, title FROM history ORDER BY viewed_at DESC'
      );
    } catch (error) {
      console.error('[useHistory] loadHistory error:', error);
      return [];
    }
  }, [db]);

  return { addToHistory, loadHistory };
}
