import * as Application from 'expo-application';
import { Alert, Linking, Platform, ToastAndroid } from 'react-native';
import { AppUpdate } from 'react-native-update-in-app';

const GITHUB_OWNER = process.env.EXPO_PUBLIC_GITHUB_OWNER;
const GITHUB_REPO = process.env.EXPO_PUBLIC_GITHUB_REPO;

AppUpdate.onDownloadProgress(event => {
  if (event.status === 'start') {
    ToastAndroid.show('Завантаження почалось', ToastAndroid.SHORT);
  }

  if (event.status === 'end') {
    ToastAndroid.show('Завантаження закінчилось', ToastAndroid.SHORT);
    try {
      AppUpdate.installApp(event.apkFileName);
    } catch (e) {
      console.error('Install error:', e);
      Alert.alert(
        'Не вдалось встановити',
        'Схоже, що потрібно надати дозвіл на установку APK. Відкрийте налаштування та дозвольте установку з цього джерела.',
        [
          { text: 'Скасувати', style: 'cancel' },
          { text: 'Відкрити налаштування', onPress: () => Linking.openSettings() }
        ]
      );
    }
  }

  if (event.status === 'error') {
    ToastAndroid.show(event.errorMessage, ToastAndroid.SHORT);
    console.error('Error:', event.errorMessage);
  }
});

export function useAutoUpdate() {
  const startUpdateCheck = async () => {
    try {
      if (process.env.NODE_ENV === 'development') return;
      if (Platform.OS === 'ios') return;

      await checkForUpdate();
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const checkForUpdate = async () => {
    try {
      const currentVersion = Application.nativeApplicationVersion || '0.0.0';

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`
      );
      const data = await response.json();

      const latestVersion = data.tag_name;
      const apkAsset = data.assets?.find((a: Record<string, any>) => a.name.endsWith('.apk'));

      if (!apkAsset) {
        console.info('APK for latest release not found');
        return;
      }

      const apkUrl = apkAsset.browser_download_url;

      if (Platform.OS === 'android' && `v${currentVersion}` !== latestVersion) {
        Alert.alert(
          'Доступна нова версія',
          'Бажаєте завантажити та встановити оновлення?',
          [
            {
              text: 'Скасувати',
              onPress: () =>
                ToastAndroid.show(
                  'Завантаження та встановлення оновлення відхилено',
                  ToastAndroid.SHORT
                )
            },
            {
              text: 'Завантажити',
              onPress: async () => {
                try {
                  AppUpdate.downloadApp(apkUrl);
                } catch (e) {
                  console.error('Download error:', e);
                  Alert.alert(
                    'Не вдалося завантажити',
                    'Переконайтесь, що у додатку є дозвіл на установку APK.',
                    [
                      { text: 'Скасувати', style: 'cancel' },
                      { text: 'Відкрити налаштування', onPress: () => Linking.openSettings() }
                    ]
                  );
                }
              }
            }
          ],
          {
            cancelable: true,
            onDismiss: () =>
              ToastAndroid.show(
                'Завантаження та встановлення оновлення відхилено',
                ToastAndroid.SHORT
              )
          }
        );
      }
    } catch (error) {
      console.error('Error checking GitHub release:', error);
    }
  };

  return { startUpdateCheck };
}
