import { useAppContext } from '@/hooks/useAppContext';

export function useBookmarks() {
  const { bookmarks, isBookmarked, toggleBookmark } = useAppContext();
  return { bookmarks, isBookmarked, toggleBookmark };
}
