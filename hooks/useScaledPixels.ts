import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
const CURRENT_RESOLUTION = Math.sqrt(height * height + width * width);

const create = (designSize = { width: 350, height: 680 }) => {
  if (
    !designSize ||
    !designSize.width ||
    !designSize.height ||
    typeof designSize.width !== 'number' ||
    typeof designSize.height !== 'number'
  ) {
    throw new Error(
      'Invalid design size object! must have width and height fields of type Number.'
    );
  }
  const DESIGN_RESOLUTION = Math.sqrt(
    designSize.height * designSize.height + designSize.width * designSize.width
  );
  const RESOLUTIONS_PROPORTION = CURRENT_RESOLUTION / DESIGN_RESOLUTION;
  return (size: number) => RESOLUTIONS_PROPORTION * size;
};

const designResolution = {
  width: 1280,
  height: 720
};

export const scaledPixels = create(designResolution);
