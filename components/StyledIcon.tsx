import { COLORS, ICON_SIZE } from '@/constants/ui';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { type OpaqueColorValue } from 'react-native';

type StyledIconSize = keyof typeof ICON_SIZE;

type StyledIconProps = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'size' | 'color'> & {
  size?: StyledIconSize;
  color?: string | OpaqueColorValue;
};

const StyledIcon: React.FC<StyledIconProps> = ({
  size = 'normal' as StyledIconSize,
  color = COLORS.PRIMARY_TEXT,
  ...props
}) => {
  return <MaterialCommunityIcons color={color} size={scaledPixels(ICON_SIZE[size])} {...props} />;
};

export default StyledIcon;
