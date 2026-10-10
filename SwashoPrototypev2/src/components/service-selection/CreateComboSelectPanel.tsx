import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type CreateComboSelectPanelProps = {
  scale: number;
  children: ReactNode;
};

/** Flat create-combo catalog shell for Figma `58828:2550` / `58836:3069` (no inset card). */
export function CreateComboSelectPanel({ scale, children }: CreateComboSelectPanelProps) {
  return <View style={[styles.root, { paddingHorizontal: 16 * scale }]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
  },
});
