import { useApplication } from '@/context/app.context';

export function useHistory() {
  const { loadHistory, addToHistory } = useApplication();
  return { loadHistory, addToHistory };
}
