import { ApplicationContext, ApplicationContextType } from '@/context/ApplicationContext';
import { useSecureStore } from '@/hooks/useSecureStore';
import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export const useApplication = () => useContext(ApplicationContext);

interface ApplicationProviderProps {
  children: ReactNode;
}

export const ApplicationProvider = ({ children }: ApplicationProviderProps) => {
  const [isReady, setIsReady] = useState(false);
  const { width, height } = useWindowDimensions();
  const orientation: 'portrait' | 'landscape' = height >= width ? 'portrait' : 'landscape';

  const [categories, setCategories] = useState<string[]>([]);

  const [apiBaseUrl, setApiBaseUrl, refreshApiBaseUrl, removeApiBaseUrl] = useSecureStore<
    string | null
  >('apiBaseUrl', process.env.EXPO_PUBLIC_API_URL || null);

  const [apiBaseToken, setApiBaseToken, refreshApiBaseToken, removeApiBaseToken] = useSecureStore<
    string | null
  >('apiBaseToken', process.env.EXPO_PUBLIC_API_TOKEN || null);

  const [history, setHistory, refreshHistory, removeHistory] = useSecureStore<string[]>(
    'history',
    []
  );

  const [bookmarks, setBookmarks, refreshBookmarks, removeBookmarks] = useSecureStore<string[]>(
    'bookmarks',
    []
  );

  useEffect(() => {
    const loadStorage = async () => {
      try {
        await Promise.all([
          refreshApiBaseUrl(),
          refreshApiBaseToken(),
          refreshHistory(),
          refreshBookmarks()
        ]);
      } catch (err) {
        console.error('Error loading data from secure store', err);
      } finally {
        setIsReady(true);
      }
    };
    loadStorage();
  }, []);

  const clearApiBase = async () => {
    await removeApiBaseUrl();
    await removeApiBaseToken();
  };

  const clearHistory = async () => {
    await removeHistory();
  };

  const clearBookmarks = async () => {
    await removeBookmarks();
  };

  const contextValue: ApplicationContextType = useMemo(
    () => ({
      isReady,
      orientation,
      apiBaseUrl,
      setApiBaseUrl,
      apiBaseToken,
      setApiBaseToken,
      history: history ?? [],
      setHistory,
      bookmarks: bookmarks ?? [],
      setBookmarks,
      categories,
      setCategories,
      clearApiBase,
      clearHistory,
      clearBookmarks
    }),
    [isReady, orientation, apiBaseUrl, apiBaseToken, history, bookmarks, categories]
  );

  return <ApplicationContext.Provider value={contextValue}>{children}</ApplicationContext.Provider>;
};

// import { ApplicationContext, ApplicationContextType } from '@/context/ApplicationContext';
// import { useSecureStore } from '@/hooks/useSecureStore';
// import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
// import { useWindowDimensions } from 'react-native';

// export const useApplication = () => useContext(ApplicationContext);

// interface ApplicationProviderProps {
//   children: ReactNode;
// }

// export const ApplicationProvider = ({ children }: ApplicationProviderProps) => {
//   const [isReady, setIsReady] = useState(false);

//   const { width, height } = useWindowDimensions();

//   const orientation: 'portrait' | 'landscape' = height >= width ? 'portrait' : 'landscape';

//   const [categories, setCategories] = useState<string[]>([]);

//   const [apiBaseUrl, setApiBaseUrl, refreshApiBaseUrl, removeApiBaseUrl] = useSecureStore<
//     string | null
//   >('apiBaseUrl', process.env.EXPO_PUBLIC_API_URL || null);

//   const [apiBaseToken, setApiBaseToken, refreshApiBaseToken, removeApiBaseToken] = useSecureStore<
//     string | null
//   >('apiBaseToken', process.env.EXPO_PUBLIC_API_TOKEN || null);

//   const [history, setHistory, refreshHistory, removeHistory] = useSecureStore<string[]>(
//     'history',
//     []
//   );

//   const [bookmarks, setBookmarks, refreshBookmarks, removeBookmarks] = useSecureStore<string[]>(
//     'bookmarks',
//     []
//   );

//   useEffect(() => {
//     const loadStorage = async () => {
//       try {
//         await Promise.all([
//           refreshApiBaseUrl(),
//           refreshApiBaseToken(),
//           refreshHistory(),
//           refreshBookmarks()
//         ]);
//       } catch (err) {
//         console.error('Error loading data from secure store', err);
//       } finally {
//         setIsReady(true);
//       }
//     };

//     console.log('loadStorage', loadStorage);

//     loadStorage();
//   }, []);

//   const clearApiBase = async () => {
//     await removeApiBaseUrl();
//     await removeApiBaseToken();
//   };

//   const clearHistory = async () => {
//     await removeHistory();
//   };

//   const clearBookmarks = async () => {
//     await removeBookmarks();
//   };

//   const contextValue: ApplicationContextType = useMemo(
//     () => ({
//       isReady,
//       orientation,
//       apiBaseUrl,
//       setApiBaseUrl,
//       apiBaseToken,
//       setApiBaseToken,
//       history: history ?? [],
//       setHistory,
//       bookmarks: bookmarks ?? [],
//       setBookmarks,
//       categories: categories ?? [],
//       setCategories,
//       clearApiBase,
//       clearHistory,
//       clearBookmarks
//     }),
//     [
//       isReady,
//       orientation,
//       apiBaseUrl,
//       setApiBaseUrl,
//       apiBaseToken,
//       setApiBaseToken,
//       history,
//       setHistory,
//       bookmarks,
//       setBookmarks,
//       categories,
//       setCategories,
//       clearApiBase,
//       clearHistory,
//       clearBookmarks
//     ]
//   );
//   return <ApplicationContext.Provider value={contextValue}>{children}</ApplicationContext.Provider>;
// };
