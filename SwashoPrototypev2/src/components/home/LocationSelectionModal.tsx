import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useServiceLocation } from '@/context/service-location-context';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';

import {
  LocationModalAddSquareIcon,
  LocationModalCloudAccent,
  LocationModalHomeIcon,
  LocationModalPenEditIcon,
  LocationModalPinHero,
} from './location-modal-icons';

/** Figma 3445:11064 — Location Selection Modal @ 412×381. */
const LOCATION_MODAL_FIGMA = {
  frameWidth: 412,
  sheetHeightAt412: 381,
  closeChipHeight: 35,
  closeToSheetGap: 21,
  sheetRadius: 24,
  heroSize: 152,
  heroTopOverlap: 89,
  cloudLargeSize: 58.478,
  cloudSmallWidth: 51.371,
  cloudSmallHeight: 36.62,
  contentPaddingHorizontal: 20,
  enableTitleTop: 54,
  addressSectionTop: 154,
  addressSectionGap: 12,
  addressListGap: 16,
} as const;

const SHEET_GRADIENT = {
  colors: ['#bfd7fe', '#ffffff'] as const,
  locations: [0, 0.35913] as const,
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
};

type LocationSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  scale: number;
  contentWidth: number;
};

export function LocationSelectionModal({
  visible,
  onClose,
  scale,
  contentWidth,
}: LocationSelectionModalProps) {
  const insets = useSafeAreaInsets();
  const {
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    locationPermission,
    isEnablingLocation,
    locationFeedback,
    clearLocationFeedback,
    requestEnableLocation,
    refreshPermissionStatus,
  } = useServiceLocation();

  const designScale = contentWidth / LOCATION_MODAL_FIGMA.frameWidth;
  const sheetHeightTarget = LOCATION_MODAL_FIGMA.sheetHeightAt412 * designScale;
  const windowHeight = Dimensions.get('window').height;
  const closeStackHeight =
    (LOCATION_MODAL_FIGMA.closeChipHeight + LOCATION_MODAL_FIGMA.closeToSheetGap) * designScale;
  const availableForSheet =
    windowHeight - insets.top - closeStackHeight - Math.max(insets.bottom, 12 * designScale);
  const maxSheetHeight = Math.min(sheetHeightTarget, Math.max(availableForSheet, 0));
  const horizontalPad = LOCATION_MODAL_FIGMA.contentPaddingHorizontal * designScale;
  const webOverflowVisible = Platform.OS === 'web' ? ('visible' as const) : undefined;

  const showLocationOff = locationPermission !== 'granted';

  const handleConfirmAddress = useCallback(
    (addressId: string) => {
      setSelectedAddressId(addressId);
      onClose();
    },
    [onClose, setSelectedAddressId],
  );

  const handleModalShow = useCallback(() => {
    clearLocationFeedback();
    void refreshPermissionStatus();
  }, [clearLocationFeedback, refreshPermissionStatus]);

  const handleEnablePress = useCallback(() => {
    void requestEnableLocation();
  }, [requestEnableLocation]);

  const handleAddAddressPress = useCallback(() => {
    Alert.alert('Add address', 'Adding addresses is not wired in this prototype yet.');
  }, []);

  const handleEditPress = useCallback(() => {
    Alert.alert('Edit address', 'Address editing is not wired in this prototype yet.');
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={handleModalShow}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onClose}
          style={styles.scrim}
        />
        <View
          style={[
            styles.sheetColumn,
            {
              width: contentWidth,
              maxHeight: windowHeight - insets.top,
              paddingTop: closeStackHeight,
              paddingBottom: Math.max(insets.bottom, 12 * designScale),
            },
          ]}
          pointerEvents="box-none">
          <View
            style={[
              styles.sheet,
              {
                width: contentWidth,
                height: maxSheetHeight,
                maxHeight: maxSheetHeight,
                borderTopLeftRadius: LOCATION_MODAL_FIGMA.sheetRadius * designScale,
                borderTopRightRadius: LOCATION_MODAL_FIGMA.sheetRadius * designScale,
                overflow: webOverflowVisible,
                ...figmaSheetShadow(designScale),
              },
            ]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              style={[
                styles.closeChip,
                styles.closeOnSheet,
                {
                  width: LOCATION_MODAL_FIGMA.closeChipHeight * designScale,
                  height: LOCATION_MODAL_FIGMA.closeChipHeight * designScale,
                  borderRadius: 999,
                  top:
                    -(
                      LOCATION_MODAL_FIGMA.closeChipHeight + LOCATION_MODAL_FIGMA.closeToSheetGap
                    ) * designScale,
                  marginLeft: (-LOCATION_MODAL_FIGMA.closeChipHeight / 2) * designScale,
                },
              ]}>
              <SheetCloseIcon width={20 * designScale} height={20 * designScale} />
            </Pressable>

            <LinearGradient
              colors={[...SHEET_GRADIENT.colors]}
              locations={[...SHEET_GRADIENT.locations]}
              start={SHEET_GRADIENT.start}
              end={SHEET_GRADIENT.end}
              style={StyleSheet.absoluteFill}
            />

            <View
              pointerEvents="none"
              style={[
                styles.heroWrap,
                {
                  width: LOCATION_MODAL_FIGMA.heroSize * designScale,
                  height: LOCATION_MODAL_FIGMA.heroSize * designScale,
                  top: -LOCATION_MODAL_FIGMA.heroTopOverlap * designScale,
                  marginLeft: (-LOCATION_MODAL_FIGMA.heroSize / 2) * designScale,
                },
              ]}>
              <LocationModalPinHero
                width={LOCATION_MODAL_FIGMA.heroSize * designScale}
                height={LOCATION_MODAL_FIGMA.heroSize * designScale}
              />
            </View>

            <View
              pointerEvents="none"
              style={[
                styles.cloudLarge,
                {
                  width: LOCATION_MODAL_FIGMA.cloudLargeSize * designScale,
                  height: LOCATION_MODAL_FIGMA.cloudLargeSize * designScale,
                  top: -63 * designScale,
                  right: 60 * designScale,
                  transform: [{ scaleY: -1 }, { rotate: '175.43deg' }],
                },
              ]}>
              <LocationModalCloudAccent
                width={LOCATION_MODAL_FIGMA.cloudLargeSize * designScale}
                height={LOCATION_MODAL_FIGMA.cloudLargeSize * designScale}
                style={{ opacity: 0.94 }}
              />
            </View>

            <View
              pointerEvents="none"
              style={[
                styles.cloudSmall,
                {
                  width: LOCATION_MODAL_FIGMA.cloudSmallWidth * designScale,
                  height: LOCATION_MODAL_FIGMA.cloudSmallHeight * designScale,
                  top: -10 * designScale,
                  left: contentWidth * 0.25 + 34 * designScale,
                  transform: [{ scaleY: -1 }, { rotate: '175.04deg' }],
                },
              ]}>
              <LocationModalCloudAccent
                width={LOCATION_MODAL_FIGMA.cloudSmallWidth * designScale}
                height={LOCATION_MODAL_FIGMA.cloudSmallHeight * designScale}
                style={{ opacity: 0.94 }}
              />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: 54 * designScale,
                paddingBottom: 24 * designScale,
                paddingHorizontal: horizontalPad,
              }}
              showsVerticalScrollIndicator={false}>
              {showLocationOff ? (
                <View style={{ alignItems: 'center', gap: 8 * designScale, marginBottom: 22 * designScale }}>
                  <Text
                    style={[
                      styles.enableTitle,
                      { fontSize: 18 * designScale, lineHeight: 16 * designScale },
                    ]}>
                    Your Location is OFF
                  </Text>
                  <Text
                    style={[
                      styles.enableCaption,
                      { fontSize: 12 * designScale, lineHeight: 16 * designScale },
                    ]}>
                    Switch it ON to get your Exact Location
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Enable location"
                    disabled={isEnablingLocation}
                    onPress={handleEnablePress}
                    style={({ pressed }) => [
                      styles.enableButton,
                      {
                        borderRadius: SwashoRadii.sm * designScale,
                        paddingHorizontal: 8 * designScale,
                        paddingVertical: 6 * designScale,
                        opacity: pressed || isEnablingLocation ? 0.75 : 1,
                      },
                    ]}>
                    {isEnablingLocation ? (
                      <ActivityIndicator color={SwashoColors.primary600} size="small" />
                    ) : (
                      <Text
                        style={[
                          styles.enableButtonLabel,
                          { fontSize: 14 * designScale, lineHeight: 12 * designScale },
                        ]}>
                        Enable
                      </Text>
                    )}
                  </Pressable>
                  {locationFeedback ? (
                    <Text
                      style={[
                        styles.feedback,
                        {
                          fontSize: 11 * designScale,
                          lineHeight: 14 * designScale,
                          marginTop: 4 * designScale,
                        },
                      ]}>
                      {locationFeedback}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View style={{ alignItems: 'center', marginBottom: 22 * designScale }}>
                  <Text
                    style={[
                      styles.enableTitle,
                      { fontSize: 18 * designScale, lineHeight: 16 * designScale },
                    ]}>
                    Your Location is ON
                  </Text>
                </View>
              )}

              <View style={{ gap: LOCATION_MODAL_FIGMA.addressSectionGap * designScale }}>
                <Text
                  style={[
                    styles.sectionLabel,
                    { fontSize: 12 * designScale, lineHeight: 16 * designScale },
                  ]}>
                  Choose Address
                </Text>

                <View style={{ gap: LOCATION_MODAL_FIGMA.addressListGap * designScale }}>
                  {savedAddresses.map((address) => {
                    const selected = selectedAddressId === address.id;
                    return (
                      <Pressable
                        key={address.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${address.label} address`}
                        accessibilityState={{ selected }}
                        onPress={() => handleConfirmAddress(address.id)}
                        style={({ pressed }) => [
                          styles.addressCard,
                          {
                            borderRadius: SwashoRadii.md * designScale,
                            paddingHorizontal: 12 * designScale,
                            paddingVertical: 8 * designScale,
                            borderColor: selected ? SwashoColors.primary300 : SwashoColors.neutral200,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}>
                        <View style={[styles.addressHeaderRow, { paddingRight: 8 * designScale }]}>
                          <View style={[styles.addressTitleRow, { gap: 6 * designScale }]}>
                            <LocationModalHomeIcon width={18 * designScale} height={18 * designScale} />
                            <Text
                              style={[
                                styles.addressTitle,
                                { fontSize: 16 * designScale, lineHeight: 14 * designScale },
                              ]}>
                              {address.label}
                            </Text>
                          </View>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Edit ${address.label} address`}
                            onPress={(event) => {
                              event.stopPropagation();
                              handleEditPress();
                            }}
                            hitSlop={8}
                            style={({ pressed }) => [
                              styles.editRow,
                              { gap: 6 * designScale, opacity: pressed ? 0.7 : 1 },
                            ]}>
                            <LocationModalPenEditIcon width={20 * designScale} height={20 * designScale} />
                            <Text
                              style={[
                                styles.editLabel,
                                { fontSize: 14 * designScale, lineHeight: 12 * designScale },
                              ]}>
                              Edit
                            </Text>
                          </Pressable>
                        </View>
                        <Text
                          style={[
                            styles.addressBody,
                            { fontSize: 12 * designScale, lineHeight: 20 * designScale },
                          ]}>
                          {address.fullLine}
                        </Text>
                      </Pressable>
                    );
                  })}

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Add new address"
                    onPress={handleAddAddressPress}
                    style={({ pressed }) => [
                      styles.addAddressCard,
                      {
                        borderRadius: SwashoRadii.md * designScale,
                        paddingHorizontal: 12 * designScale,
                        paddingVertical: 8 * designScale,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}>
                    <View style={[styles.addRow, { gap: 4 * designScale }]}>
                      <LocationModalAddSquareIcon width={18 * designScale} height={18 * designScale} />
                      <Text
                        style={[
                          styles.addLabel,
                          { fontSize: 12 * designScale, lineHeight: 10 * designScale },
                        ]}>
                        Add New Address
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function figmaSheetShadow(scale: number): StyleProp<ViewStyle> {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0px ${4 * scale}px ${2 * scale}px rgba(0, 0, 0, 0.25)`,
    } as StyleProp<ViewStyle>;
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 * scale },
    shadowOpacity: 0.25,
    shadowRadius: 2 * scale,
    elevation: 6,
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1000,
    elevation: 1000,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SwashoColors.modalScrim,
    zIndex: 0,
  },
  sheetColumn: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 2,
    ...(Platform.OS === 'web' ? { overflow: 'visible' as const } : null),
  },
  sheet: {
    backgroundColor: SwashoColors.surface,
    alignSelf: 'center',
    position: 'relative',
  },
  closeChip: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  closeOnSheet: {
    left: '50%',
  },
  heroWrap: {
    position: 'absolute',
    left: '50%',
    zIndex: 3,
  },
  cloudLarge: {
    position: 'absolute',
    zIndex: 2,
  },
  cloudSmall: {
    position: 'absolute',
    zIndex: 2,
  },
  enableTitle: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.neutral950,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  enableCaption: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.neutral600,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  enableButton: {
    borderWidth: 1,
    borderColor: SwashoColors.primary300,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableButtonLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.primary600,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  feedback: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.neutral600,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  sectionLabel: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.neutral600,
    letterSpacing: 0.5,
  },
  addressCard: {
    borderWidth: 1,
    backgroundColor: SwashoColors.surface,
    gap: 4,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontFamily: 'Poppins_600SemiBold',
    color: SwashoColors.neutral900,
    letterSpacing: 0.5,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  editLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.primary600,
    letterSpacing: 0.5,
  },
  addressBody: {
    fontFamily: 'Poppins_600SemiBold',
    color: SwashoColors.neutral900,
    letterSpacing: 0.5,
  },
  addAddressCard: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: SwashoColors.primary200,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 18,
  },
  addLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.primary600,
    letterSpacing: 0.5,
  },
});
