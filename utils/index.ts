type Matrix<T> = T[][];

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
