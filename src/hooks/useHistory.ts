import { useStorage } from '@/context/storage';

export function useHistory() {
  const { loadHistory, addToHistory } = useStorage();
  return { loadHistory, addToHistory };
}
