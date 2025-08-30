type Matrix<T> = T[][];

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const validUrl = (url: string | null | undefined, baseUrl: string): string | null => {
  if (!url || !url?.length) return null;
  return new URL(url, baseUrl).toString();
};

export function transpose<T>(matrix: Matrix<T>): Matrix<T> {
  const maxLength = Math.max(...matrix.map(row => row.length));
  const result: Matrix<T> = Array.from({ length: maxLength }, () => []);

  matrix.forEach(row => {
    row.forEach((item, colIndex) => {
      result[colIndex].push(item);
    });
  });

  return result;
}
