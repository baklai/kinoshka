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
  const [storageValue, setStorageValue] = useState<Nullable<T>>(defaultValue);

  const loadStorageItem = useCallback(async () => {
    try {
      const stringValue = await SecureStore.getItemAsync(storageKey);
      if (stringValue === null) {
        setStorageValue(defaultValue);
        return;
      }
      let parsedValue: T;
      try {
        parsedValue = JSON.parse(stringValue) as T;
      } catch {
        parsedValue = stringValue as unknown as T;
      }
      // Преобразуем null в defaultValue
      if (parsedValue === null) parsedValue = defaultValue;
      if (JSON.stringify(storageValue) !== JSON.stringify(parsedValue)) {
        setStorageValue(parsedValue);
      }
    } catch (error) {
      console.error('Error reading from SecureStore:', error);
    }
  }, [storageKey, storageValue, defaultValue]);

  const setStorageItem: Setter<T> = useCallback(
    async valueOrUpdater => {
      setStorageValue(prev => {
        // вычисляем новое значение
        const value =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (prevState: T) => T)(prev as T)
            : valueOrUpdater;

        // если массив или объект не изменился, возвращаем прежнюю ссылку
        if (JSON.stringify(prev) === JSON.stringify(value)) return prev;

        // сохраняем в SecureStore
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        SecureStore.setItemAsync(storageKey, valueToStore).catch(error =>
          console.error('Error writing to SecureStore:', error)
        );

        return value;
      });
    },
    [storageKey]
  );

  const refreshStorageItem = useCallback(async () => {
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

// import * as SecureStore from 'expo-secure-store';
// import { useCallback, useEffect, useState } from 'react';

// type Nullable<T> = T | null;
// type Setter<T> = (value: T) => Promise<void>;
// type Remover = () => Promise<void>;
// type Refresher = () => Promise<void>;

// export function useSecureStore<T>(
//   storageKey: string,
//   defaultValue: T
// ): [Nullable<T>, Setter<T>, Refresher, Remover] {
//   const [storageValue, setStorageValue] = useState<Nullable<T>>(defaultValue);

//   const loadStorageItem = useCallback(async () => {
//     try {
//       const stringValue = await SecureStore.getItemAsync(storageKey);
//       if (stringValue === null) {
//         setStorageValue(defaultValue);
//         return;
//       }
//       try {
//         const parsedValue = JSON.parse(stringValue) as T;
//         setStorageValue(parsedValue);
//       } catch {
//         setStorageValue(stringValue as unknown as T);
//       }
//     } catch (error) {
//       console.error('Error reading from SecureStore:', error);
//     }
//   }, [storageKey, defaultValue]);

//   const setStorageItem: Setter<T> = useCallback(
//     async valueOrUpdater => {
//       setStorageValue(prev => {
//         const value =
//           typeof valueOrUpdater === 'function'
//             ? (valueOrUpdater as (prevState: T) => T)(prev as T)
//             : valueOrUpdater;
//         const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
//         SecureStore.setItemAsync(storageKey, valueToStore).catch(error =>
//           console.error('Error writing to SecureStore:', error)
//         );
//         return value;
//       });
//     },
//     [storageKey]
//   );

//   const refreshStorageItem = useCallback(async () => {
//     await loadStorageItem();
//   }, [loadStorageItem]);

//   const removeStorageItem = useCallback(async () => {
//     try {
//       await SecureStore.deleteItemAsync(storageKey);
//       setStorageValue(null);
//     } catch (error) {
//       console.error('Error deleting from SecureStore:', error);
//     }
//   }, [storageKey]);

//   useEffect(() => {
//     loadStorageItem();
//   }, [loadStorageItem]);

//   return [storageValue, setStorageItem, refreshStorageItem, removeStorageItem];
// }

// import * as SecureStore from 'expo-secure-store';
// import { useCallback, useEffect, useMemo, useState } from 'react';

// type Nullable<T> = T | null;
// type Setter<T> = (value: T) => Promise<void>;
// type Remover = () => Promise<void>;
// type Refresher = () => Promise<void>;

// export function useSecureStore<T>(
//   storageKey: string,
//   defaultValue: T
// ): [Nullable<T>, Setter<T>, Refresher, Remover] {
//   const [storageValue, setStorageValue] = useState<Nullable<T>>(defaultValue);

//   const loadStorageItem = useCallback(async () => {
//     try {
//       const stringValue = await SecureStore.getItemAsync(storageKey);

//       if (stringValue === null) {
//         setStorageValue(defaultValue);
//         return;
//       }

//       try {
//         const parsedValue = JSON.parse(stringValue) as T;
//         setStorageValue(parsedValue);
//       } catch {
//         setStorageValue(stringValue as unknown as T);
//       }
//     } catch (error) {
//       console.error('Error reading from SecureStore:', error);
//     }
//   }, [storageKey, defaultValue]);

//   const setStorageItem: Setter<T> = useCallback(
//     async (value: T) => {
//       try {
//         const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
//         await SecureStore.setItemAsync(storageKey, valueToStore);
//         setStorageValue(value);
//       } catch (error) {
//         console.error('Error writing to SecureStore:', error);
//       }
//     },
//     [storageKey, defaultValue]
//   );

//   const refreshStorageItem: Refresher = useCallback(async () => {
//     await loadStorageItem();
//   }, [loadStorageItem]);

//   const removeStorageItem: Remover = useCallback(async () => {
//     try {
//       await SecureStore.deleteItemAsync(storageKey);
//       setStorageValue(null);
//     } catch (error) {
//       console.error('Error deleting from SecureStore:', error);
//     }
//   }, [storageKey, defaultValue]);

//   useEffect(() => {
//     loadStorageItem();
//   }, [loadStorageItem]);

//   return useMemo(
//     () =>
//       [storageValue, setStorageItem, refreshStorageItem, removeStorageItem] as [
//         Nullable<T>,
//         Setter<T>,
//         Refresher,
//         Remover
//       ],
//     [storageValue, setStorageItem, refreshStorageItem, removeStorageItem]
//   );
// }
