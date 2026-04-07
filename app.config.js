module.exports = {
  expo: {
    name: 'KinoshkaTV',
    slug: 'KinoshkaTV',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '0.0.1',
    orientation: 'default',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'dark',
    scheme: 'kinoshka',
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/splash.png',
        backgroundImage: './assets/images/splash.png',
        monochromeImage: './assets/images/splash.png'
      },
      predictiveBackGestureEnabled: false,
      package: 'com.anonymous.KinoshkaTV',
      permissions: ['REQUEST_INSTALL_PACKAGES']
    },
    plugins: [
      [
        '@react-native-tvos/config-tv',
        {
          isTV: true,
          showVerboseWarnings: false,
          tvosDeploymentTarget: '15.1',
          removeFlipperOnAndroid: true,
          androidTVBanner: './assets/tv_icons/tv_banner.png',
          androidTVIcon: './assets/tv_icons/tv_icon.png',
          appleTVImages: {
            icon: './assets/tv_icons/icon-1280x768.png',
            iconSmall: './assets/tv_icons/icon-400x240.png',
            iconSmall2x: './assets/tv_icons/icon-800x480.png',
            topShelf: './assets/tv_icons/icon-1920x720.png',
            topShelf2x: './assets/tv_icons/icon-3840x1440.png',
            topShelfWide: './assets/tv_icons/icon-2320x720.png',
            topShelfWide2x: './assets/tv_icons/icon-4640x1440.png'
          }
        }
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#0F0F0F',
          android: {
            image: './assets/images/splash.png',
            imageWidth: 200
          },
          resizeMode: 'contain'
        }
      ],
      'expo-router',
      [
        'expo-screen-orientation',
        {
          initialOrientation: 'DEFAULT'
        }
      ],
      [
        'expo-font',
        {
          android: {
            fonts: [
              {
                fontFamily: 'e-Ukraine',
                fontDefinitions: [
                  {
                    path: './assets/fonts/e-ukraine/e-Ukraine-Thin.otf',
                    weight: 100
                  },
                  {
                    path: './assets/fonts/e-ukraine/e-Ukraine-UltraLight.otf',
                    weight: 200
                  },
                  {
                    path: './assets/fonts/e-ukraine/e-Ukraine-Light.otf',
                    weight: 300
                  },
                  {
                    path: './assets/fonts/e-ukraine/e-Ukraine-Regular.otf',
                    weight: 400
                  },
                  {
                    path: './assets/fonts/e-ukraine/e-Ukraine-Medium.otf',
                    weight: 500
                  },
                  {
                    path: './assets/fonts/e-ukraine/e-Ukraine-Bold.otf',
                    weight: 600
                  }
                ]
              }
            ]
          }
        }
      ],
      [
        'expo-localization',
        {
          supportedLocales: {
            ios: ['en', 'ua', 'ru'],
            android: ['en', 'ua', 'ru']
          }
        }
      ],
      'expo-sharing',
      'expo-file-system',
      function withM3uIntentSupport(config) {
        const { withAndroidManifest } = require('@expo/config-plugins');
        return withAndroidManifest(config, async config => {
          const manifest = config.modResults;
          const app = manifest.manifest;

          if (!app.queries) app.queries = [];
          const existingMimeTypes = app.queries
            .flatMap(q => q.intent || [])
            .flatMap(i => i.data || [])
            .map(d => d.$?.['android:mimeType']);

          const mimeTypesToAdd = ['application/vnd.apple.mpegurl', 'audio/x-mpegurl', 'video/*'];
          for (const mimeType of mimeTypesToAdd) {
            if (!existingMimeTypes.includes(mimeType)) {
              app.queries.push({
                intent: [
                  {
                    action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
                    data: [{ $: { 'android:mimeType': mimeType } }]
                  }
                ]
              });
            }
          }
          if (!app.application) app.application = [{}];
          const application = app.application[0];
          if (!application.provider) application.provider = [];

          const providerName = 'expo.modules.filesystem.FileSystemFileProvider';
          const alreadyAdded = application.provider.some(
            p => p.$?.['android:name'] === providerName
          );
          if (!alreadyAdded) {
            application.provider.push({
              $: {
                'android:name': providerName,
                'android:authorities': '${applicationId}.FileSystemFileProvider',
                'android:exported': 'false',
                'android:grantUriPermissions': 'true'
              },
              'meta-data': [
                {
                  $: {
                    'android:name': 'android.support.FILE_PROVIDER_PATHS',
                    'android:resource': '@xml/file_system_provider_paths'
                  }
                }
              ]
            });
          }

          return config;
        });
      }
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
};
