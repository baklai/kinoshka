import { PlayerType } from '@/types/player.type';

export const DEFAULT_PLAYER = 'default';

export const PLAYERS: Record<string, PlayerType> = {
  vlc: { key: 'vlc', name: 'VLC', packageName: 'org.videolan.vlc' },
  ad: { key: 'ad', name: 'MX Player', packageName: 'com.mxtech.videoplayer.ad' },
  free: { key: 'free', name: 'BSPlayer', packageName: 'com.bsplayer.bspandroid.free' },
  kmplayer: { key: 'kmplayer', name: 'KMPlayer', packageName: 'com.kmplayer' },
  default: { key: 'default', name: 'За замовчуванням', packageName: 'default' }
};
