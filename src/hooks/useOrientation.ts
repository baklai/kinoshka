import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const { width, height } = useWindowDimensions();

  return useMemo<Orientation>(() => (height >= width ? 'portrait' : 'landscape'), [width, height]);
}
