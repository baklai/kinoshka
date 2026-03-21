import * as Device from 'expo-device';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export type DeviceKind = 'phone' | 'tablet' | 'tv';

export function useDeviceSetup() {
  const [deviceKind, setDeviceKind] = useState<DeviceKind>('phone');

  useEffect(() => {
    const prepare = async () => {
      const isTV = Platform.isTV || Platform.isTVOS;
      const isTablet =
        !isTV &&
        (Device.deviceType === Device.DeviceType.TABLET ||
          Device.deviceType === Device.DeviceType.DESKTOP);

      if (isTV) {
        setDeviceKind('tv');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else if (isTablet) {
        setDeviceKind('tablet');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else {
        setDeviceKind('phone');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    };

    prepare();
  }, []);

  return deviceKind;
}
