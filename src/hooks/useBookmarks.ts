import { useApplication } from '@/context/app.context';

export function useBookmarks() {
  const { bookmarks, isBookmarked, toggleBookmark } = useApplication();
  return { bookmarks, isBookmarked, toggleBookmark };
}
