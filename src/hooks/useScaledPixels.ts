import { Dimensions } from 'react-native';

const designResolution = {
  width: 1280,
  height: 720
};

function createScaler(screenWidth: number, screenHeight: number) {
  const DESIGN_RESOLUTION = Math.sqrt(designResolution.height ** 2 + designResolution.width ** 2);
  const CURRENT_RESOLUTION = Math.sqrt(screenHeight ** 2 + screenWidth ** 2);
  const PROPORTION = CURRENT_RESOLUTION / DESIGN_RESOLUTION;
  return (size: number) => Math.round(PROPORTION * size);
}

const { width, height } = Dimensions.get('screen');
export const scaledPixels = createScaler(width, height);
