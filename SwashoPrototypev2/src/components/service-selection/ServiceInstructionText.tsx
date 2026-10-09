import { StyleSheet, Text } from 'react-native';

type ServiceInstructionTextProps = {
  children: string;
  scale: number;
};

export function ServiceInstructionText({ children, scale }: ServiceInstructionTextProps) {
  return (
    <Text
      style={[
        styles.text,
        { fontSize: 13 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale, width: 373 * scale },
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins_400Regular',
    color: '#464646',
  },
});
