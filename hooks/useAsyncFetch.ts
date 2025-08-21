import { useApplication } from '@/providers/ApplicationProvider';
import { useCallback, useState } from 'react';

interface RequestOptions {
  params?: Record<string, any>;
  config?: RequestInit;
}

interface RequestArgs extends RequestOptions {
  method: 'get' | 'post' | 'put' | 'delete';
  url?: string;
  body?: any;
}

export const useAsyncFetch = <T = any>(endpoint: string) => {
  const { apiBaseUrl, apiBaseToken } = useApplication();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const buildQuery = (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();

    const cleanValue = (value: any): any => {
      if (Array.isArray(value)) {
        return value.filter(v => v !== null && v !== undefined);
      }
      if (value && typeof value === 'object') {
        const cleaned: Record<string, any> = {};
        Object.entries(value).forEach(([k, v]) => {
          const cv = cleanValue(v);
          if (cv !== undefined && (Array.isArray(cv) ? cv.length > 0 : true)) {
            cleaned[k] = cv;
          }
        });
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
      }
      return value;
    };

    Object.entries(params).forEach(([key, value]) => {
      const cleaned = cleanValue(value);
      if (cleaned !== undefined) {
        query.append(key, typeof cleaned === 'object' ? JSON.stringify(cleaned) : String(cleaned));
      }
    });

    return query.toString() ? `?${query.toString()}` : '';
  };

  const request = useCallback(
    async ({ method, url = '', body = null, params = {}, config }: RequestArgs): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const query = buildQuery(params);
        const response = await fetch(`${apiBaseUrl}/${endpoint}${url}${query}`, {
          method: method.toUpperCase(),
          headers: {
            ...(apiBaseToken ? { Authorization: `Bearer ${apiBaseToken}` } : {}),
            'Content-Type': 'application/json',
            ...(config?.headers || {})
          },
          body: body ? JSON.stringify(body) : undefined,
          ...config
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data);
          throw new Error(data?.message || response.statusText);
        }

        return data;
      } catch (err: any) {
        setError(err.message || err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, apiBaseUrl, apiBaseToken]
  );

  const findAll = useCallback(
    ({ params, config }: RequestOptions = {}) => request({ method: 'get', params, config }),
    [request]
  );

  const findOneById = useCallback(
    (id: string | number, { params, config }: RequestOptions = {}) =>
      request({ method: 'get', url: `/${id}`, params, config }),
    [request]
  );

  return { loading, error, findAll, findOneById };
};
