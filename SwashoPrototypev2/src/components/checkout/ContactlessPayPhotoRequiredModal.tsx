import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type ContactlessPayPhotoRequiredModalProps = {
  visible: boolean;
  scale: number;
  onUploadPhoto: () => void;
  onCancel: () => void;
};

/** Blocks Pay on checkout review until mandatory contactless photos are uploaded. */
export function ContactlessPayPhotoRequiredModal({
  visible,
  scale,
  onUploadPhoto,
  onCancel,
}: ContactlessPayPhotoRequiredModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onCancel}
          style={styles.scrim}
        />
        <View
          style={[
            styles.card,
            {
              borderRadius: SwashoRadii.lg * scale,
              paddingHorizontal: 20 * scale,
              paddingTop: 24 * scale,
              paddingBottom: 20 * scale,
              gap: 20 * scale,
              marginHorizontal: 24 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 16 * scale,
                lineHeight: 22 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral950,
                textAlign: 'center',
              },
            ]}>
            Photo is Required for Contactless service
          </Text>
          <View style={{ gap: 10 * scale, width: '100%' }}>
            <ServiceSelectionButton
              label="Upload photo"
              variant="primary"
              scale={scale}
              onPress={onUploadPhoto}
              style={{ width: '100%' }}
            />
            <ServiceSelectionButton
              label="Cancel"
              variant="secondary"
              scale={scale}
              onPress={onCancel}
              style={{ width: '100%' }}
            />
          </View>
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
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SwashoColors.modalScrim,
  },
  card: {
    backgroundColor: SwashoColors.surface,
    zIndex: 1,
    maxWidth: 340,
    width: '100%',
  },
});
