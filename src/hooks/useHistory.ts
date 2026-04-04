import { useAppContext } from '@/hooks/useAppContext';
import { MovieProps } from '@/types/movie.type';

export function useHistory() {
  const { history, addHistory } = useAppContext();

  const loadHistory = (): Pick<MovieProps, 'source' | 'poster' | 'title'>[] => history;
  const addToHistory = (movie: Pick<MovieProps, 'source' | 'poster' | 'title'>) =>
    addHistory(movie);

  return { history, loadHistory, addToHistory };
}
