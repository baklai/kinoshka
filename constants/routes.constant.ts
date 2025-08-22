export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SEARCH: '/search',
  DETAILS: '/details',
  BOOKMARKS: '/bookmarks',
  HISTORY: '/history',
  OPTIONS: '/options'
} as const;

export type RouteParams = {
  HOME: undefined;
  ABOUT: undefined;
  SEARCH: undefined;
  DETAILS: { id: string };
  BOOKMARKS: undefined;
  HISTORY: undefined;
  OPTIONS: undefined;
};

export type RouteName = keyof typeof ROUTES;
