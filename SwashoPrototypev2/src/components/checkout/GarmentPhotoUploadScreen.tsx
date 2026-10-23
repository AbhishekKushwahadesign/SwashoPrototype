import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon } from '@/components/home/figma-icons';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { SearchStatusBar } from '@/components/search/SearchStatusBar';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';
import { useProviderCart } from '@/context/provider-cart-context';
import { buildCheckoutBasketGroups, type CheckoutBasketLine } from '@/lib/build-checkout-basket';
import { getProviderGarmentName } from '@/data/providers';
import {
  basketGarmentThumbVariant,
  garmentPhotoProgressFraction,
  garmentPhotoSlotsFromBasketLine,
  garmentPhotoUploadHint,
  type GarmentPhotoServiceSlot,
} from '@/lib/contactless-garment-photos';
import { CheckoutGarmentThumbIcon, CheckoutInfoIcon } from './checkout-review-icons';
import { ContactlessGalleryAddPrimaryIcon } from './contactless-basket-photo-icons';
import { ContactlessHowItWorksModal } from './ContactlessHowItWorksModal';
import { usePickGarmentPhoto } from './use-pick-garment-photo';

const DEFAULT_GARMENT_HERO = require('@/assets/checkout/contactless-workflow-upload.png');
const STATUS_BAR_HEIGHT = 32;

type GarmentPhotoUploadScreenProps = {
  providerId: string;
  query: string;
  initialGarmentId: string;
  initialServiceId: string;
};

function GarmentProgressRing({
  scale,
  fraction,
  active,
  children,
}: {
  scale: number;
  fraction: number;
  active: boolean;
  children: ReactNode;
}) {
  const size = active ? 81 * scale : 65 * scale;
  const stroke = 3 * scale;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, fraction));
  const dashOffset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {active ? (
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={SwashoColors.neutral300}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={SwashoColors.neutral950}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
      ) : null}
      <View
        style={{
          width: active ? 71 * scale : 56 * scale,
          height: active ? 71 * scale : 56 * scale,
          borderRadius: (active ? 71 : 56) * scale / 2,
          backgroundColor: SwashoColors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: active ? 0 : 1 * scale,
          borderColor: SwashoColors.neutral300,
        }}>
        {children}
      </View>
    </View>
  );
}

function ServiceCarouselChip({
  scale,
  slot,
  active,
  onPress,
}: {
  scale: number;
  slot: GarmentPhotoServiceSlot;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4 * scale,
        paddingHorizontal: active ? 5 * scale : 5 * scale,
        height: 35 * scale,
        borderRadius: 20 * scale,
        borderWidth: active ? 1.5 * scale : 0,
        borderColor: active ? '#252525' : 'transparent',
        backgroundColor: active ? SwashoColors.surface : 'transparent',
      }}>
      <Text
        numberOfLines={1}
        style={[
          searchFont('semibold'),
          {
            fontSize: 14 * scale,
            lineHeight: 14 * scale,
            letterSpacing: 0.5 * scale,
            color: active ? SwashoColors.neutral950 : SwashoColors.neutral700,
            maxWidth: 120 * scale,
          },
        ]}>
        {slot.title}
      </Text>
      <View
        style={{
          width: 24 * scale,
          height: 24 * scale,
          borderRadius: 12 * scale,
          borderWidth: 1.25 * scale,
          borderColor: active ? '#292929' : SwashoColors.neutral700,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            searchFont('semibold'),
            {
              fontSize: 14 * scale,
              lineHeight: 14 * scale,
              color: active ? SwashoColors.neutral950 : SwashoColors.neutral700,
            },
          ]}>
          {slot.quantity}
        </Text>
      </View>
    </Pressable>
  );
}

export function GarmentPhotoUploadScreen({
  providerId,
  query,
  initialGarmentId,
  initialServiceId,
}: GarmentPhotoUploadScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const { getProviderCartEntries, getSelection, getContactlessGarmentPhotos, addContactlessGarmentPhoto } =
    useProviderCart();
  const { pickPhoto } = usePickGarmentPhoto();
  const [guideVisible, setGuideVisible] = useState(false);

  const photoStore = getContactlessGarmentPhotos(providerId);
  const entries = getProviderCartEntries(providerId);
  const basketGroups = useMemo(
    () => buildCheckoutBasketGroups(providerId, query, entries),
    [entries, providerId, query],
  );

  const garmentLines = useMemo(
    () => basketGroups.flatMap((group) => group.lines),
    [basketGroups],
  );

  const garmentContexts = useMemo(() => {
    const fromBasket = garmentLines.map((line) => ({
      line,
      slots: garmentPhotoSlotsFromBasketLine(line, getSelection(providerId, line.serviceId)),
    }));
    if (fromBasket.length > 0) {
      return fromBasket;
    }
    const selection = getSelection(providerId, initialGarmentId);
    const fallbackLine: CheckoutBasketLine = {
      serviceId: initialGarmentId,
      title: getProviderGarmentName(initialGarmentId, providerId, query) ?? 'Garment',
      detailLines: [],
      price: 0,
    };
    const slots = garmentPhotoSlotsFromBasketLine(fallbackLine, selection);
    if (slots.length === 0) {
      slots.push({
        serviceId: initialServiceId,
        title: 'Dry Cleaning',
        quantity: 1,
        optional: false,
      });
      if (slots.length < 2) {
        slots.push({
          serviceId: `${initialServiceId}-2`,
          title: 'Dry Cleaning',
          quantity: 2,
          optional: false,
        });
        slots.push({
          serviceId: `${initialServiceId}-3`,
          title: 'Dry Cleaning',
          quantity: 3,
          optional: false,
        });
      }
    }
    return [{ line: fallbackLine, slots }];
  }, [garmentLines, getSelection, initialGarmentId, initialServiceId, providerId, query]);

  const initialGarmentIndex = Math.max(
    0,
    garmentContexts.findIndex((ctx) => ctx.line.serviceId === initialGarmentId),
  );

  const [garmentIndex, setGarmentIndex] = useState(initialGarmentIndex);
  const [serviceIndex, setServiceIndex] = useState(0);
  const garmentScrollRef = useRef<ScrollView>(null);

  const activeContext = garmentContexts[garmentIndex] ?? garmentContexts[0];
  const activeLine = activeContext?.line;
  const activeSlots = activeContext?.slots ?? [];

  useEffect(() => {
    if (!activeSlots.length) {
      return;
    }
    const idx = activeSlots.findIndex((slot) => slot.serviceId === initialServiceId);
    if (idx >= 0) {
      setServiceIndex(idx);
    }
  }, [activeSlots, initialServiceId, garmentIndex]);

  const activeService = activeSlots[serviceIndex] ?? activeSlots[0];
  const uploadHint = garmentPhotoUploadHint(activeSlots);
  const activePhotos = useMemo(() => {
    if (!activeLine || !activeService) {
      return [];
    }
    return photoStore[activeLine.serviceId]?.[activeService.serviceId] ?? [];
  }, [activeLine, activeService, photoStore]);

  const heroUri = activePhotos[0];

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  }, [router]);

  const handleUploadPress = useCallback(async () => {
    if (!activeLine || !activeService) {
      return;
    }
    const captureGarmentId = activeLine.serviceId;
    const captureServiceId = activeService.serviceId;
    const uri = await pickPhoto();
    if (!uri) {
      return;
    }
    addContactlessGarmentPhoto(providerId, captureGarmentId, captureServiceId, uri);
  }, [activeLine, activeService, addContactlessGarmentPhoto, pickPhoto, providerId]);

  const onGarmentScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / contentWidth);
      if (index !== garmentIndex && index >= 0 && index < garmentContexts.length) {
        setGarmentIndex(index);
        setServiceIndex(0);
      }
    },
    [contentWidth, garmentContexts.length, garmentIndex],
  );

  if (!activeLine) {
    return (
      <View style={[styles.root, { paddingTop: safeTop + 48 }]}>
        <Pressable onPress={handleBack} accessibilityRole="button">
          <Text style={[searchFont('medium'), { color: SwashoColors.primary600 }]}>Back</Text>
        </Pressable>
        <Text style={[searchFont('semibold'), { marginTop: 16 }]}>No garments in basket</Text>
      </View>
    );
  }

  const bottomPanelHeight = 310 * scale;

  return (
    <View style={styles.root}>
      <View style={[styles.statusBar, { top: safeTop, height: STATUS_BAR_HEIGHT * scale }]}>
        <SearchStatusBar scale={scale} />
      </View>

      <View style={[styles.heroWrap, { top: safeTop + 20 * scale, bottom: bottomPanelHeight }]}>
        <Image
          source={heroUri ? { uri: heroUri } : DEFAULT_GARMENT_HERO}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.headerRow, { top: safeTop + 27 * scale, paddingHorizontal: 20 * scale }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={handleBack} hitSlop={8}>
          <ArrowLeftIcon width={20 * scale} height={20 * scale} />
        </Pressable>
        <Text
          numberOfLines={1}
          style={[
            searchFont('semibold'),
            styles.headerTitle,
            { fontSize: 15 * scale, letterSpacing: 0.6 * scale, flex: 1, textAlign: 'center' },
          ]}>
          {activeLine.title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Photo upload guide"
          onPress={() => setGuideVisible(true)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 2 * scale }}>
          <CheckoutInfoIcon width={16 * scale} height={16 * scale} color="#0D0D0D" />
          <Text style={[searchFont('regular'), { fontSize: 13 * scale, letterSpacing: 0.52 * scale, color: '#000' }]}>
            Guide
          </Text>
        </Pressable>
      </View>

      <View
        style={[
          styles.bottomPanel,
          {
            height: bottomPanelHeight,
            paddingTop: 12 * scale,
            paddingBottom: 24 * scale + insets.bottom,
          },
        ]}>
        {uploadHint ? (
          <Text
            style={[
              searchFont('medium'),
              {
                fontSize: 14 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral950,
                textAlign: 'center',
                marginBottom: 16 * scale,
              },
            ]}>
            {uploadHint}
          </Text>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 16 * scale,
            paddingHorizontal: 16 * scale,
            alignItems: 'center',
            minWidth: contentWidth,
            justifyContent: 'center',
          }}
          style={{ maxHeight: 40 * scale, marginBottom: 20 * scale }}>
          {activeSlots.map((slot, index) => (
            <ServiceCarouselChip
              key={slot.serviceId}
              scale={scale}
              slot={slot}
              active={index === serviceIndex}
              onPress={() => setServiceIndex(index)}
            />
          ))}
        </ScrollView>

        <ScrollView
          ref={garmentScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onGarmentScrollEnd}
          contentContainerStyle={{
            alignItems: 'flex-end',
            paddingHorizontal: contentWidth * 0.28,
            gap: 12 * scale,
            minHeight: 90 * scale,
          }}
          style={{ marginBottom: 16 * scale }}>
          {garmentContexts.map((ctx, index) => {
            const fraction = garmentPhotoProgressFraction(photoStore, ctx.line.serviceId, ctx.slots);
            const isActive = index === garmentIndex;
            return (
              <Pressable
                key={ctx.line.serviceId}
                accessibilityRole="button"
                onPress={() => {
                  setGarmentIndex(index);
                  setServiceIndex(0);
                  garmentScrollRef.current?.scrollTo({ x: index * contentWidth, animated: true });
                }}>
                <GarmentProgressRing scale={scale} fraction={fraction} active={isActive}>
                  <CheckoutGarmentThumbIcon
                    variant={basketGarmentThumbVariant(ctx.line.serviceId)}
                    width={28 * scale}
                    height={25 * scale}
                  />
                </GarmentProgressRing>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 * scale, paddingHorizontal: 24 * scale }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Upload image"
            onPress={handleUploadPress}
            style={{
              width: 54 * scale,
              height: 54 * scale,
              borderRadius: 6.3 * scale,
              borderWidth: 1.3 * scale,
              borderColor: SwashoColors.neutral300,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 4.7 * scale,
              shadowOffset: { width: 0, height: 0 },
              backgroundColor: SwashoColors.surface,
            }}>
            <ContactlessGalleryAddPrimaryIcon width={14 * scale} height={14 * scale} />
            <Text
              style={[
                searchFont('semibold'),
                {
                  fontSize: 8.3 * scale,
                  lineHeight: 9.4 * scale,
                  letterSpacing: 0.69 * scale,
                  color: SwashoColors.primary600,
                  marginTop: 2 * scale,
                  textAlign: 'center',
                },
              ]}>
              Upload Image
            </Text>
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 * scale }}>
            {activePhotos.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                style={{
                  width: 48.5 * scale,
                  height: 48.5 * scale,
                  borderRadius: 4.8 * scale,
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.homeIndicatorWrap} pointerEvents="none">
        <HomeIndicator scale={scale} />
      </View>

      <ContactlessHowItWorksModal
        visible={guideVisible}
        onClose={() => setGuideVisible(false)}
        scale={scale}
        contentWidth={contentWidth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  statusBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
  },
  heroWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#000',
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0)',
    zIndex: 15,
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 25,
  },
});
