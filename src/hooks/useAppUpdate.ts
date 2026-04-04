import * as Application from 'expo-application';
import {
  cacheDirectory,
  createDownloadResumable,
  getContentUriAsync
} from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { useCallback } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

function compareVersions(current: string, latest: string): boolean {
  const normalize = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const [cMaj, cMin, cPat] = normalize(current);
  const [lMaj, lMin, lPat] = normalize(latest);
  if (lMaj > cMaj) return true;
  if (lMaj === cMaj && lMin > cMin) return true;
  return lMaj === cMaj && lMin === cMin && lPat > cPat;
}

export function useAppUpdate(checkUrl: string) {
  const downloadAndInstall = async (url: string) => {
    try {
      const fileUri = `${cacheDirectory}update.apk`;

      ToastAndroid.show('Завантаження оновлень почалось', ToastAndroid.SHORT);

      const downloadResumable = createDownloadResumable(url, fileUri, {});

      const result = await downloadResumable.downloadAsync();

      if (!result || !result.uri) {
        ToastAndroid.show('Помилка завантаження оновлень', ToastAndroid.SHORT);
        return;
      }

      ToastAndroid.show('Завантаження оновлень завершено', ToastAndroid.SHORT);

      const contentUri = await getContentUriAsync(result.uri);

      await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
        data: contentUri,
        flags: 1
      });
    } catch {
      Alert.alert('Помилка', 'Не вдалося оновити додаток. Перевірте підключення до мережі.');
    }
  };

  const checkForUpdate = useCallback(async () => {
    if (__DEV__) return;
    if (Platform.OS !== 'android') return;

    try {
      const currentVersion = Application.nativeApplicationVersion ?? '0.0.0';

      const response = await fetch(checkUrl);

      if (!response.ok) {
        ToastAndroid.show(`GitHub API error: ${response.status}`, ToastAndroid.SHORT);
        return;
      }

      const data = await response.json();

      const latestTag: string = data?.tag_name;
      const apkAsset = data?.assets?.find((a: { name: string }) => a?.name?.endsWith('.apk'));

      if (!apkAsset) {
        ToastAndroid.show('APK не знайдено в останньому випуску', ToastAndroid.SHORT);
        return;
      }

      if (!compareVersions(currentVersion, latestTag)) return;

      Alert.alert(
        'Доступна нова версія',
        'Бажаєте завантажити та встановити оновлення?',
        [
          {
            text: 'Пізніше',
            style: 'cancel',
            onPress: () => ToastAndroid.show('Оновлення відкладені', ToastAndroid.SHORT)
          },
          {
            text: 'Завантажити',
            onPress: () => downloadAndInstall(apkAsset.browser_download_url)
          }
        ],
        {
          cancelable: true,
          onDismiss: () => ToastAndroid.show('Оновлення відхилено', ToastAndroid.SHORT)
        }
      );
    } catch {
      ToastAndroid.show('Не вдалося перевірити оновлення', ToastAndroid.SHORT);
    }
  }, [checkUrl]);

  return { checkForUpdate };
}
