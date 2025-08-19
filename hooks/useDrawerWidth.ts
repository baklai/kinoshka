import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export default function useDrawerWidth() {
  const [drawerWidth, setDrawerWidth] = useState<number>(0);

  const calculateWidth = (window: ScaledSize) => {
    const { width, height } = window;
    const isLandscape = width > height;

    const percentage = isLandscape ? 0.5 : 0.8;

    const minWidth = 250;
    const maxWidth = 340;

    return Math.min(Math.max(width * percentage, minWidth), maxWidth);
  };

  useEffect(() => {
    const updateWidth = ({ window }: { window: ScaledSize }) => {
      setDrawerWidth(calculateWidth(window));
    };

    setDrawerWidth(calculateWidth(Dimensions.get('window')));

    const subscription = Dimensions.addEventListener('change', updateWidth);
    return () => subscription?.remove();
  }, []);

  return drawerWidth;
}
