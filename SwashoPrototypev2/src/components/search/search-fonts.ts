import { Platform, type TextStyle } from 'react-native';

type SearchFontWeight = 'medium' | 'semibold';

export function searchFont(weight: SearchFontWeight): TextStyle {
  if (Platform.OS === 'web') {
    return {
      fontFamily: 'Poppins',
      fontWeight: weight === 'medium' ? '500' : '600',
    };
  }

  return {
    fontFamily: weight === 'medium' ? 'Poppins_500Medium' : 'Poppins_600SemiBold',
  };
}
