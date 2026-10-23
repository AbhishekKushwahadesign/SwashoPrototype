import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon } from '@/components/home/figma-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
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

/** Figma 3399:16791 — reference garment on hanger (not contactless workflow art). */
const DEFAULT_GARMENT_HERO = require('@/assets/checkout/garment-photo-upload-hero.png');
const STATUS_BAR_HEIGHT = 32;
const BOTTOM_PANEL_HEIGHT = 310;
type GarmentPhotoUploadScreenProps = {
  providerId: string;
  query: string;
  initialGarmentId: string;
  initialServiceId: string;
};

/** Fixed overlay: progress ring only (icons scroll underneath). */
function GarmentProgressRingFrame({ scale, fraction }: { scale: number; fraction: number }) {
  const size = 81 * scale;
  const stroke = 3 * scale;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, fraction));
  const dashOffset = circumference * (1 - progress);

  return (
    <View
      style={[
        { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
        figmaShadow(FigmaShadows.providerCard, scale),
      ]}>
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
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

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
  const inner = active ? 71 * scale : 56 * scale;
  const stroke = 3 * scale;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, fraction));
  const dashOffset = circumference * (1 - progress);

  return (
    <View
      style={[
        { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
        active ? figmaShadow(FigmaShadows.providerCard, scale) : null,
      ]}>
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
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
      ) : null}
      <View
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
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

function ServiceCarouselCenterFrame({ scale }: { scale: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 20 * scale,
        borderWidth: 1.5 * scale,
        borderColor: '#252525',
        backgroundColor: 'transparent',
      }}
    />
  );
}

function ServiceCarouselChip({
  scale,
  slot,
  emphasized,
}: {
  scale: number;
  slot: GarmentPhotoServiceSlot;
  emphasized: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4 * scale,
        paddingHorizontal: 5 * scale,
        height: 35 * scale,
        borderRadius: 20 * scale,
        borderWidth: 0,
        backgroundColor: emphasized ? SwashoColors.surface : 'transparent',
        maxWidth: emphasized ? 145 * scale : 120 * scale,
      }}>
      <Text
        numberOfLines={1}
        style={[
          searchFont('semibold'),
          {
            fontSize: 14 * scale,
            lineHeight: 14 * scale,
            letterSpacing: 0.5 * scale,
            color: emphasized ? SwashoColors.neutral950 : SwashoColors.neutral700,
            maxWidth: emphasized ? 95 * scale : 110 * scale,
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
          borderColor: emphasized ? '#292929' : SwashoColors.neutral700,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            searchFont('semibold'),
            {
              fontSize: 14 * scale,
              lineHeight: 14 * scale,
              color: emphasized ? SwashoColors.neutral950 : SwashoColors.neutral700,
            },
          ]}>
          {slot.quantity}
        </Text>
      </View>
    </View>
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
  const serviceScrollRef = useRef<ScrollView>(null);
  const [trackCarouselWidth, setTrackCarouselWidth] = useState(contentWidth);
  const lastServiceSnapAt = useRef(0);
  const serviceIndexRef = useRef(0);
  const serviceScrollSyncingRef = useRef(false);

  const activeContext = garmentContexts[garmentIndex] ?? garmentContexts[0];
  const activeLine = activeContext?.line;
  const activeSlots = activeContext?.slots ?? [];
  const activeGarmentId = activeLine?.serviceId ?? '';
  const activeSlotKey = useMemo(
    () => activeSlots.map((slot) => slot.serviceId).join('|'),
    [activeSlots],
  );
  const serviceChipHeight = 35 * scale;
  const serviceSnapStep = 148 * scale;

  const appliedInitialServiceRef = useRef(false);

  useEffect(() => {
    if (!activeSlots.length) {
      return;
    }
    setServiceIndex(0);
    requestAnimationFrame(() => {
      serviceScrollRef.current?.scrollTo({ x: 0, animated: false });
    });
  }, [activeGarmentId, activeSlotKey, serviceSnapStep]);

  useEffect(() => {
    if (!activeSlots.length || appliedInitialServiceRef.current) {
      return;
    }
    const idx = activeSlots.findIndex((slot) => slot.serviceId === initialServiceId);
    const nextIndex = idx >= 0 ? idx : 0;
    appliedInitialServiceRef.current = true;
    setServiceIndex(nextIndex);
    requestAnimationFrame(() => {
      serviceScrollRef.current?.scrollTo({ x: nextIndex * serviceSnapStep, animated: false });
    });
  }, [activeGarmentId, activeSlotKey, activeSlots.length, initialServiceId, serviceSnapStep]);

  serviceIndexRef.current = serviceIndex;

  const activeService = activeSlots[serviceIndex] ?? activeSlots[0];
  const uploadHint = garmentPhotoUploadHint(activeSlots);
  const activePhotos = useMemo(() => {
    if (!activeLine || !activeService) {
      return [];
    }
    return photoStore[activeLine.serviceId]?.[activeService.serviceId] ?? [];
  }, [activeLine, activeService, photoStore]);

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

  const garmentRingSize = 81 * scale;
  const garmentActiveInner = 71 * scale;
  const garmentInactiveInner = 56 * scale;
  const garmentSnapStep = garmentRingSize;
  const garmentCarouselInset = Math.max(0, (trackCarouselWidth - garmentSnapStep) / 2);
  const serviceCarouselInset = Math.max(0, (trackCarouselWidth - serviceSnapStep) / 2);
  const serviceSnapOffsets = useMemo(
    () => activeSlots.map((_, index) => index * serviceSnapStep),
    [activeSlots.length, serviceSnapStep],
  );

  const scrollServiceToIndex = useCallback(
    (index: number, animated: boolean) => {
      serviceScrollRef.current?.scrollTo({ x: index * serviceSnapStep, animated });
    },
    [serviceSnapStep],
  );

  const snapServiceToNearest = useCallback(
    (offsetX: number, animated: boolean) => {
      const now = Date.now();
      if (now - lastServiceSnapAt.current < 40) {
        return;
      }
      lastServiceSnapAt.current = now;

      const maxIndex = Math.max(0, activeSlots.length - 1);
      const index = Math.max(0, Math.min(maxIndex, Math.round(offsetX / serviceSnapStep)));
      const targetX = index * serviceSnapStep;

      setServiceIndex((prev) => (prev === index ? prev : index));

      if (Math.abs(offsetX - targetX) > 0.5 || !animated) {
        serviceScrollSyncingRef.current = true;
        requestAnimationFrame(() => {
          serviceScrollRef.current?.scrollTo({ x: targetX, animated });
          if (!animated) {
            serviceScrollSyncingRef.current = false;
          }
        });
      }
    },
    [activeSlots.length, serviceSnapStep],
  );

  const handleServiceScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (serviceScrollSyncingRef.current) {
        return;
      }
      const offsetX = event.nativeEvent.contentOffset.x;
      const maxIndex = Math.max(0, activeSlots.length - 1);
      const index = Math.max(0, Math.min(maxIndex, Math.round(offsetX / serviceSnapStep)));
      setServiceIndex((prev) => (prev === index ? prev : index));
    },
    [activeSlots.length, serviceSnapStep],
  );

  const handleServiceScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      serviceScrollSyncingRef.current = false;
      snapServiceToNearest(event.nativeEvent.contentOffset.x, true);
    },
    [snapServiceToNearest],
  );

  const garmentSnapOffsets = useMemo(
    () => garmentContexts.map((_, index) => index * garmentSnapStep),
    [garmentContexts.length, garmentSnapStep],
  );

  const scrollGarmentToIndex = useCallback(
    (index: number, animated: boolean) => {
      garmentScrollRef.current?.scrollTo({ x: index * garmentSnapStep, animated });
    },
    [garmentSnapStep],
  );

  const garmentInactiveScale = garmentInactiveInner / garmentActiveInner;
  const lastGarmentSnapAt = useRef(0);

  const snapGarmentToNearest = useCallback(
    (offsetX: number, animated: boolean) => {
      const now = Date.now();
      if (now - lastGarmentSnapAt.current < 40) {
        return;
      }
      lastGarmentSnapAt.current = now;

      const maxIndex = Math.max(0, garmentContexts.length - 1);
      const index = Math.max(0, Math.min(maxIndex, Math.round(offsetX / garmentSnapStep)));
      const targetX = index * garmentSnapStep;

      setGarmentIndex((prev) => {
        if (prev !== index) {
          setServiceIndex(0);
          requestAnimationFrame(() => {
            serviceScrollRef.current?.scrollTo({ x: 0, animated: false });
          });
        }
        return index;
      });

      if (Math.abs(offsetX - targetX) > 0.5 || !animated) {
        requestAnimationFrame(() => {
          garmentScrollRef.current?.scrollTo({ x: targetX, animated });
        });
      }
    },
    [garmentContexts.length, garmentSnapStep],
  );

  const handleGarmentScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const maxIndex = Math.max(0, garmentContexts.length - 1);
      const index = Math.max(0, Math.min(maxIndex, Math.round(offsetX / garmentSnapStep)));
      setGarmentIndex((prev) => (prev === index ? prev : index));
    },
    [garmentContexts.length, garmentSnapStep],
  );

  const handleGarmentScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      snapGarmentToNearest(event.nativeEvent.contentOffset.x, true);
    },
    [snapGarmentToNearest],
  );

  useEffect(() => {
    const index = Math.max(
      0,
      garmentContexts.findIndex((ctx) => ctx.line.serviceId === initialGarmentId),
    );
    const frame = requestAnimationFrame(() => {
      snapGarmentToNearest(index * garmentSnapStep, false);
    });
    return () => cancelAnimationFrame(frame);
  }, [
    garmentContexts.length,
    trackCarouselWidth,
    garmentSnapStep,
    initialGarmentId,
    snapGarmentToNearest,
  ]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const idx = Math.min(serviceIndexRef.current, Math.max(0, activeSlots.length - 1));
      serviceScrollRef.current?.scrollTo({ x: idx * serviceSnapStep, animated: false });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeSlots.length, activeGarmentId, trackCarouselWidth, serviceSnapStep]);

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

  const bottomPanelHeight = BOTTOM_PANEL_HEIGHT * scale;

  const headerTop = safeTop + 27 * scale;

  return (
    <View style={styles.root}>
      <View style={[styles.statusBar, { top: safeTop, height: STATUS_BAR_HEIGHT * scale }]}>
        <SearchStatusBar scale={scale} />
      </View>

      <View
        style={[
          styles.heroRegion,
          {
            top: safeTop + STATUS_BAR_HEIGHT * scale,
            bottom: bottomPanelHeight + insets.bottom,
          },
        ]}>
        <Image
          source={DEFAULT_GARMENT_HERO}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </View>

      <View
        style={[
          styles.headerRow,
          { top: headerTop, paddingHorizontal: 20 * scale, minHeight: 26 * scale },
        ]}>
        <View style={[styles.headerSide, { flex: 1, alignItems: 'flex-start' }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={handleBack} hitSlop={8}>
            <ArrowLeftIcon width={20 * scale} height={20 * scale} />
          </Pressable>
        </View>
        <View style={[styles.headerCenter, { flex: 2 }]}>
          <Text
            numberOfLines={1}
            style={[
              searchFont('semibold'),
              {
                fontSize: 15 * scale,
                letterSpacing: 0.6 * scale,
                lineHeight: 20 * scale,
                color: '#000',
                textAlign: 'center',
              },
            ]}>
            {activeLine.title}
          </Text>
        </View>
        <View style={[styles.headerSide, { flex: 1, alignItems: 'flex-end' }]}>
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
      </View>

      <View
        style={[
          styles.bottomPanel,
          {
            height: bottomPanelHeight + insets.bottom,
            paddingTop: 12 * scale,
            paddingBottom: insets.bottom,
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
                  paddingHorizontal: 16 * scale,
                },
              ]}>
              {uploadHint}
            </Text>
          ) : null}

          <View
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width;
              if (width > 0 && Math.abs(width - trackCarouselWidth) > 0.5) {
                setTrackCarouselWidth(width);
              }
            }}
            style={[
              styles.carouselClip,
              { marginBottom: 20 * scale, height: serviceChipHeight, justifyContent: 'center' },
            ]}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: serviceCarouselInset,
                top: 0,
                height: serviceChipHeight,
                width: serviceSnapStep,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}>
              <ServiceCarouselCenterFrame scale={scale} />
            </View>
            <ScrollView
              ref={serviceScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToOffsets={serviceSnapOffsets}
              snapToAlignment="start"
              disableIntervalMomentum
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={handleServiceScroll}
              onMomentumScrollEnd={handleServiceScrollEnd}
              onScrollEndDrag={handleServiceScrollEnd}
              style={[
                { width: '100%', maxHeight: serviceChipHeight },
                Platform.OS === 'web'
                  ? ({ overflowX: 'auto', touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as object)
                  : null,
              ]}
              contentContainerStyle={{
                alignItems: 'center',
                paddingHorizontal: serviceCarouselInset,
                minHeight: serviceChipHeight,
              }}>
              {activeSlots.map((slot, index) => {
                const isCentered = index === serviceIndex;
                return (
                  <Pressable
                    key={slot.serviceId}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isCentered }}
                    delayPressIn={80}
                    onPress={() => {
                      setServiceIndex(index);
                      scrollServiceToIndex(index, true);
                    }}
                    style={[
                      {
                        width: serviceSnapStep,
                        height: serviceChipHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      Platform.OS === 'web' ? ({ touchAction: 'pan-x', cursor: 'grab' } as object) : null,
                    ]}>
                    <View style={{ transform: [{ scale: isCentered ? 1 : 0.94 }] }}>
                      <ServiceCarouselChip scale={scale} slot={slot} emphasized={isCentered} />
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={[
              styles.carouselClip,
              { marginBottom: 16 * scale, height: garmentRingSize, justifyContent: 'center' },
            ]}>
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: garmentCarouselInset,
                top: 0,
                width: garmentRingSize,
                height: garmentRingSize,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}>
              <GarmentProgressRingFrame
                scale={scale}
                fraction={garmentPhotoProgressFraction(
                  photoStore,
                  activeLine.serviceId,
                  activeSlots,
                )}
              />
            </View>

            <ScrollView
              ref={garmentScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToOffsets={garmentSnapOffsets}
              snapToAlignment="start"
              disableIntervalMomentum
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={handleGarmentScroll}
              onMomentumScrollEnd={handleGarmentScrollEnd}
              onScrollEndDrag={handleGarmentScrollEnd}
              style={
                Platform.OS === 'web'
                  ? ({ scrollSnapType: 'x mandatory', overflowX: 'auto' } as object)
                  : undefined
              }
              contentContainerStyle={{
                alignItems: 'center',
                paddingHorizontal: garmentCarouselInset,
                minHeight: garmentRingSize,
              }}>
              {garmentContexts.map((ctx, index) => {
                const isCentered = index === garmentIndex;
                const iconW = (isCentered ? 40 : 28) * scale;
                const iconH = (isCentered ? 43 : 25) * scale;
                return (
                  <Pressable
                    key={ctx.line.serviceId}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isCentered }}
                    onPress={() => {
                      setGarmentIndex(index);
                      setServiceIndex(0);
                      scrollGarmentToIndex(index, true);
                    }}
                    style={[
                      {
                        width: garmentSnapStep,
                        height: garmentRingSize,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      Platform.OS === 'web'
                        ? ({ scrollSnapAlign: 'center', scrollSnapStop: 'always' } as object)
                        : null,
                    ]}>
                    <View
                      style={{
                        width: garmentActiveInner,
                        height: garmentActiveInner,
                        borderRadius: garmentActiveInner / 2,
                        backgroundColor: SwashoColors.surface,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: isCentered ? 0 : 1 * scale,
                        borderColor: SwashoColors.neutral300,
                        transform: [{ scale: isCentered ? 1 : garmentInactiveScale }],
                      }}>
                      <CheckoutGarmentThumbIcon
                        variant={basketGarmentThumbVariant(ctx.line.serviceId)}
                        width={iconW}
                        height={iconH}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12 * scale,
              paddingHorizontal: 24 * scale,
              marginTop: 'auto',
              paddingBottom: 8 * scale,
            }}>
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
  headerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  headerSide: {
    justifyContent: 'center',
  },
  headerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  heroRegion: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    zIndex: 1,
  },
  heroImage: {
    position: 'absolute',
    width: '102.36%',
    height: '166.7%',
    left: '-1.18%',
    top: '-22.59%',
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 15,
    justifyContent: 'flex-start',
  },
  carouselClip: {
    overflow: 'hidden',
    width: '100%',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 25,
  },
});
