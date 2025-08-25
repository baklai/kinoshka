import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useCallback, useMemo, useState } from 'react';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const API_BASE_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

export const useAsyncFetch = <T = any>(endpoint?: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const instance: AxiosInstance = useMemo(() => {
    return axios.create({
      baseURL: endpoint ? `${API_BASE_URL}/${endpoint}` : API_BASE_URL,
      timeout: 60000,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_BASE_TOKEN}`
      }
    });
  }, [endpoint]);

  const request = useCallback(
    async (path?: string, options?: AxiosRequestConfig): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await instance.get(path || '', options);
        return response.data;
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || err.message);
          throw new Error(err.response?.data?.message || err.message);
        }
        setError(err.message || err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [instance]
  );

  const fetch = useCallback(
    (id?: string | number, options?: AxiosRequestConfig) => {
      const path = id ? `/${id}` : '';
      return request(path, options);
    },
    [request]
  );

  return { loading, error, fetch };
};
