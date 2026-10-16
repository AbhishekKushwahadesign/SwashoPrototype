import { Platform, type TextStyle } from 'react-native';

type SearchFontWeight = 'regular' | 'medium' | 'semibold';

export function searchFont(weight: SearchFontWeight): TextStyle {
  if (Platform.OS === 'web') {
    const fontWeight =
      weight === 'regular' ? '400' : weight === 'medium' ? '500' : '600';
    return {
      fontFamily: 'Poppins',
      fontWeight,
    };
  }

  const fontFamily =
    weight === 'regular'
      ? 'Poppins_400Regular'
      : weight === 'medium'
        ? 'Poppins_500Medium'
        : 'Poppins_600SemiBold';

  return { fontFamily };
}
