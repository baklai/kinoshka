export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const validUrl = (url: string | null | undefined, baseUrl: string): string | null => {
  if (!url || !url.length) return null;
  return new URL(url, baseUrl).toString();
};
