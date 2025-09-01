import * as Application from 'expo-application';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Alert, Platform } from 'react-native';

const GITHUB_OWNER = process.env.EXPO_PUBLIC_GITHUB_OWNER;
const GITHUB_REPO = process.env.EXPO_PUBLIC_GITHUB_REPO;

export function useAutoUpdate() {
  const startUpdateCheck = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        return;
      }
      await checkForUpdate();
    } catch (error) {
      console.log('Error checking for updates:', error);
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
        Alert.alert('Доступна нова версія', 'Бажаєте завантажити та встановити оновлення?', [
          { text: 'Скасувати', style: 'cancel' },
          { text: 'Завантажити', onPress: () => downloadAndInstallApk(apkUrl) }
        ]);
      }
    } catch (error) {
      console.error('Error checking GitHub release:', error);
    }
  };

  const downloadAndInstallApk = async (url: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}app-latest.apk`;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      const contentUri = await FileSystem.getContentUriAsync(uri);

      await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
        data: contentUri,
        type: 'application/vnd.android.package-archive',
        flags: 1
      });
    } catch (error) {
      console.error('Error downloading and installing APK:', error);
    }
  };
  return { startUpdateCheck };
}
