import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

import { CheckoutConfettiIcon } from '@/components/checkout/checkout-review-icons';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

export type CheckoutPayPrototypePhase = 'loading' | 'success';

type CheckoutPayPrototypeOverlayProps = {
  phase: CheckoutPayPrototypePhase | null;
  scale: number;
  title: string;
  message: string;
};

/** Full-screen prototype payment loading and order confirmation before redirect. */
export function CheckoutPayPrototypeOverlay({
  phase,
  scale,
  title,
  message,
}: CheckoutPayPrototypeOverlayProps) {
  const visible = phase != null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.root}>
        <View
          style={[
            styles.card,
            {
              borderRadius: SwashoRadii.lg * scale,
              paddingHorizontal: 24 * scale,
              paddingVertical: 28 * scale,
              gap: 16 * scale,
              marginHorizontal: 32 * scale,
            },
          ]}>
          {phase === 'loading' ? (
            <>
              <ActivityIndicator color={SwashoColors.primary600} size="large" />
              <Text
                style={[
                  searchFont('semibold'),
                  styles.title,
                  { fontSize: 17 * scale, lineHeight: 24 * scale, letterSpacing: 0.5 * scale },
                ]}>
                Processing payment…
              </Text>
              <Text
                style={[
                  searchFont('regular'),
                  styles.subtitle,
                  { fontSize: 14 * scale, lineHeight: 20 * scale, textAlign: 'center' },
                ]}>
                This is a prototype — no charge is made.
              </Text>
            </>
          ) : null}
          {phase === 'success' ? (
            <>
              <CheckoutConfettiIcon width={40 * scale} height={40 * scale} />
              <Text
                style={[
                  searchFont('semibold'),
                  styles.title,
                  { fontSize: 18 * scale, lineHeight: 24 * scale, letterSpacing: 0.5 * scale },
                ]}>
                {title}
              </Text>
              <Text
                style={[
                  searchFont('regular'),
                  styles.subtitle,
                  { fontSize: 14 * scale, lineHeight: 20 * scale, textAlign: 'center' },
                ]}>
                {message}
              </Text>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SwashoColors.modalScrim,
  },
  card: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
  },
  title: {
    color: SwashoColors.neutral950,
    textAlign: 'center',
  },
  subtitle: {
    color: SwashoColors.neutral600,
  },
});
