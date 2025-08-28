type Matrix<T> = T[][];

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export function transpose<T>(matrix: Matrix<T>): Matrix<T> {
  const maxLength = Math.max(...matrix.map(row => row.length));
  const result: Matrix<T> = Array.from({ length: maxLength }, () => []);

  matrix.forEach(row => {
    row.forEach((item, colIndex) => {
      result[colIndex].push(item);
    });
  });

  return result;
}

// const createM3U = (urls: string[]) => {
//   return `#EXTM3U\n${urls.map(url => `#EXTINF:-1,${url}\n${url}`).join('\n')}`;
// };

// const savePlaylist = async (content: string) => {
//   const path = `${RNFS.DocumentDirectoryPath}/playlist.m3u`;
//   await RNFS.writeFile(path, content, 'utf8');
//   return path;
// };

// export const openPlaylistInVLC = async (urls: string[]) => {
//   if (!urls.length) {
//     ToastAndroid.show('Список посилань пустий', ToastAndroid.SHORT);
//     return;
//   }

//   try {
//     const m3uContent = createM3U(urls);
//     const filePath = await savePlaylist(m3uContent);

//     const vlcUrl = Platform.OS === 'android' ? `vlc://${filePath}` : filePath;

//     const supported = await Linking.canOpenURL(vlcUrl);
//     if (supported) {
//       await Linking.openURL(vlcUrl);
//     } else {
//       ToastAndroid.show('VLC не встановлено або схема не підтримується', ToastAndroid.SHORT);
//     }
//   } catch (error) {
//     console.error(error);
//     ToastAndroid.show('Помилка при відкритті VLC', ToastAndroid.SHORT);
//   }
// };
