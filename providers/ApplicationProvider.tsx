import { ApplicationContext, ApplicationContextType } from '@/context/ApplicationContext';
import { useSecureStore } from '@/hooks/useAsyncStorage';
import { SplashScreen } from 'expo-router';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const { width, height } = useWindowDimensions();
  const [isApplicationReady, setIsApplicationReady] = useState(false);

  const orientation: 'portrait' | 'landscape' = height >= width ? 'portrait' : 'landscape';

  const [apiBaseUrl, setApiBaseUrl, refreshApiBaseUrl, removeApiBaseUrl] = useSecureStore<
    string | null
  >('apiBaseUrl', process.env.EXPO_PUBLIC_API_URL || null);

  const [apiBaseToken, setApiBaseToken, refreshApiBaseToken, removeApiBaseToken] = useSecureStore<
    string | null
  >('apiBaseToken', process.env.EXPO_PUBLIC_API_TOKEN || null);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    const loadStorage = async () => {
      try {
        await Promise.all([refreshApiBaseUrl(), refreshApiBaseToken()]);
      } catch (err) {
        console.error('Error loading data from SecureStore', err);
      } finally {
        setIsApplicationReady(true);
        SplashScreen.hideAsync();
      }
    };

    loadStorage();
  }, []);

  const clearApiBase = async () => {
    await removeApiBaseUrl();
    await removeApiBaseToken();
  };

  const contextValue: ApplicationContextType = {
    orientation: orientation ?? null,

    apiBaseUrl: apiBaseUrl ?? null,
    setApiBaseUrl: async (value: string) => {
      await setApiBaseUrl(value);
    },

    apiBaseToken: apiBaseToken ?? null,
    setApiBaseToken: async (value: string) => {
      await setApiBaseToken(value);
    },

    clearApiBase
  };

  if (!isApplicationReady) {
    return null;
  }

  return <ApplicationContext.Provider value={contextValue}>{children}</ApplicationContext.Provider>;
};
