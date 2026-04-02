import * as Application from 'expo-application';
import { useEffect } from 'react';
import { Alert, Linking, ToastAndroid } from 'react-native';
import { AppUpdate } from 'react-native-update-in-app';

const GITHUB_OWNER = process.env.EXPO_PUBLIC_GITHUB_OWNER;
const GITHUB_REPO = process.env.EXPO_PUBLIC_GITHUB_REPO;

function compareVersions(current: string, latest: string): boolean {
  const normalize = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const [cMaj, cMin, cPat] = normalize(current);
  const [lMaj, lMin, lPat] = normalize(latest);

  return (
    lMaj > cMaj || (lMaj === cMaj && lMin > cMin) || (lMaj === cMaj && lMin === cMin && lPat > cPat)
  );
}

export async function checkForUpdate(): Promise<void> {
  // if (__DEV__) return;

  try {
    const currentVersion = Application.nativeApplicationVersion ?? '0.0.0';

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`
    );

    console.log('response', response);

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const data = await response.json();

    console.log('data', data);

    const latestTag: string = data.tag_name;
    const apkAsset = data.assets?.find((a: { name: string }) => a.name.endsWith('.apk'));

    if (!apkAsset) {
      console.info('APK not found in latest release');
      return;
    }

    if (!compareVersions(currentVersion, latestTag)) return;

    Alert.alert(
      'Доступна нова версія',
      'Бажаєте завантажити та встановити оновлення?',
      [
        {
          text: 'Скасувати',
          onPress: () => ToastAndroid.show('Оновлення відхилено', ToastAndroid.SHORT)
        },
        {
          text: 'Завантажити',
          onPress: () => {
            try {
              AppUpdate.downloadApp(apkAsset.browser_download_url);
            } catch {
              Alert.alert('Не вдалося завантажити', 'Дозвольте установку APK у налаштуваннях.', [
                { text: 'Скасувати', style: 'cancel' },
                { text: 'Відкрити налаштування', onPress: () => Linking.openSettings() }
              ]);
            }
          }
        }
      ],
      {
        cancelable: true,
        onDismiss: () => ToastAndroid.show('Оновлення відхилено', ToastAndroid.SHORT)
      }
    );
  } catch (error) {
    console.error('Update check failed:', error);
  }
}

export function useDownloadProgressListener(): void {
  useEffect(() => {
    AppUpdate.onDownloadProgress(event => {
      if (event.status === 'start') {
        ToastAndroid.show('Завантаження почалось', ToastAndroid.SHORT);
      } else if (event.status === 'end') {
        ToastAndroid.show('Завантаження закінчилось', ToastAndroid.SHORT);
        try {
          AppUpdate.installApp(event.apkFileName);
        } catch {
          Alert.alert('Не вдалось встановити', 'Надайте дозвіл на установку APK.', [
            { text: 'Скасувати', style: 'cancel' },
            { text: 'Відкрити налаштування', onPress: () => Linking.openSettings() }
          ]);
        }
      } else if (event.status === 'error') {
        ToastAndroid.show(event.errorMessage ?? 'Помилка завантаження', ToastAndroid.SHORT);
        console.error('Download error:', event.errorMessage);
      }
    });
  }, []);
}
