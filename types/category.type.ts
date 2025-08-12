import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export interface CategoryProps {
  name: string;
  description: string;
  icon: IconName;
}
