import { useStorage } from '@/context/storage';

export function useBookmarks() {
  const { bookmarks, isBookmarked, toggleBookmark } = useStorage();
  return { bookmarks, isBookmarked, toggleBookmark };
}
