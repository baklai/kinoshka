import { RouteName, RouteParams, ROUTES } from '@/constants/routes.constant';
import { useRouter } from 'expo-router';

export function useNamedRouter() {
  const router = useRouter();

  function navigate<Name extends RouteName>(name: Name, params?: RouteParams[Name]) {
    const path = ROUTES[name];
    if (params) {
      const searchParams = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      router.push(`${path}?${searchParams}`);
    } else {
      router.push(path);
    }
  }

  function replace<Name extends RouteName>(name: Name, params?: RouteParams[Name]) {
    const path = ROUTES[name];
    if (params) {
      const searchParams = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      router.replace(`${path}?${searchParams}`);
    } else {
      router.replace(path);
    }
  }

  return { navigate, replace };
}
