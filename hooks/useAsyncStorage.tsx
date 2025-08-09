import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

type Nullable<T> = T | null;
type Setter<T> = (value: T) => Promise<void>;
type Remover = () => Promise<void>;
type Refresher = () => Promise<void>;

export function useSecureStore<T>(
  storageKey: string,
  defaultValue: T
): [Nullable<T>, Setter<T>, Refresher, Remover] {
  const [storageValue, setStorageValue] = useState<Nullable<T>>(null);

  const loadStorageItem = useCallback(async () => {
    try {
      const stringValue = await SecureStore.getItemAsync(storageKey);

      if (stringValue === null) {
        setStorageValue(defaultValue);
        return;
      }

      try {
        const parsedValue = JSON.parse(stringValue) as T;
        setStorageValue(parsedValue);
      } catch {
        setStorageValue(stringValue as unknown as T);
      }
    } catch (error) {
      console.error('Error reading from SecureStore:', error);
    }
  }, [storageKey, defaultValue]);

  const setStorageItem: Setter<T> = useCallback(
    async (value: T) => {
      try {
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        await SecureStore.setItemAsync(storageKey, valueToStore);
        setStorageValue(value);
      } catch (error) {
        console.error('Error writing to SecureStore:', error);
      }
    },
    [storageKey]
  );

  const refreshStorageItem: Refresher = useCallback(async () => {
    await loadStorageItem();
  }, [loadStorageItem]);

  const removeStorageItem: Remover = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(storageKey);
      setStorageValue(null);
    } catch (error) {
      console.error('Error deleting from SecureStore:', error);
    }
  }, [storageKey]);

  useEffect(() => {
    loadStorageItem();
  }, [loadStorageItem]);

  return [storageValue, setStorageItem, refreshStorageItem, removeStorageItem];
}
