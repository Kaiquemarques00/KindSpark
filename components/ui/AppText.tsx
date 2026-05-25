import { Text, type TextProps, type TextStyle } from 'react-native';

import { typography, type TypographyVariant } from '@/theme/typography';

type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  const baseStyle = typography[variant];
  const textStyle: TextStyle = color ? { ...baseStyle, color } : baseStyle;

  return <Text style={[textStyle, style]} allowFontScaling {...rest} />;
}
