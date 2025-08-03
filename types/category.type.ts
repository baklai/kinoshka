import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

export interface CategoryProps {
  name: string;
  description: string;
  icon: MaterialIconName;
}
