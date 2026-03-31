import { Dimensions, useWindowDimensions } from 'react-native';

const DESIGN_DIAGONAL = Math.sqrt(1280 ** 2 + 720 ** 2);

const { width: initialWidth, height: initialHeight } = Dimensions.get('screen');

function createScaler(screenWidth: number, screenHeight: number) {
  const currentDiagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  const proportion = currentDiagonal / DESIGN_DIAGONAL;
  return (size: number) => Math.round(proportion * size);
}

export function useScaledPixels() {
  const { width, height } = useWindowDimensions();
  return { scaledPixels: createScaler(width, height) };
}

export const scaledPixels = createScaler(initialWidth, initialHeight);
