import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ThemedViewProps = ViewProps & {
  type?: 'backgroundElement' | 'backgroundSelected';
};

export function ThemedView({ style, type, ...props }: ThemedViewProps) {
  const theme = useTheme();
  const backgroundColor = type ? theme[type] : undefined;

  return <View style={[{ backgroundColor }, style]} {...props} />;
}
