import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Image,
  LayoutChangeEvent,
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

function nearestCarouselOffsetIndex(offsetX: number, offsets: number[]): number {
  if (!offsets.length) {
    return 0;
  }
  let nearest = 0;
  let minDistance = Math.abs(offsetX - offsets[0]);
  for (let index = 1; index < offsets.length; index += 1) {
    const distance = Math.abs(offsetX - offsets[index]);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = index;
    }
  }
  return nearest;
}

type CenterSnapMetrics = {
  leadingInset: number;
  trailingInset: number;
  itemCenters: number[];
  snapOffsets: number[];
  contentWidth: number;
};

function buildCenterSnapMetrics(
  viewportWidth: number,
  itemWidths: number[],
  itemGap: number,
): CenterSnapMetrics {
  if (viewportWidth <= 0 || itemWidths.length === 0) {
    return { leadingInset: 0, trailingInset: 0, itemCenters: [], snapOffsets: [], contentWidth: 0 };
  }

  const firstWidth = itemWidths[0];
  const lastWidth = itemWidths[itemWidths.length - 1];
  const leadingInset = Math.max(0, viewportWidth / 2 - firstWidth / 2);
  const trailingInset = Math.max(0, viewportWidth / 2 - lastWidth / 2);
  const itemCenters: number[] = [];
  let cursor = leadingInset;

  for (let index = 0; index < itemWidths.length; index += 1) {
    const width = itemWidths[index];
    itemCenters.push(cursor + width / 2);
    cursor += width;
    if (index < itemWidths.length - 1) {
      cursor += itemGap;
    }
  }

  const snapOffsets = itemCenters.map((center) => Math.max(0, center - viewportWidth / 2));
  const itemsWidth = itemWidths.reduce(
    (sum, width, index) => sum + width + (index < itemWidths.length - 1 ? itemGap : 0),
    0,
  );
  const contentWidth = leadingInset + itemsWidth + trailingInset;

  return { leadingInset, trailingInset, itemCenters, snapOffsets, contentWidth };
}

function buildCenterSnapMetricsFromLayouts(
  viewportWidth: number,
  layouts: { x: number; width: number }[],
): CenterSnapMetrics {
  if (viewportWidth <= 0 || !layouts.length) {
    return { leadingInset: 0, trailingInset: 0, itemCenters: [], snapOffsets: [], contentWidth: 0 };
  }

  const itemCenters = layouts.map((layout) => layout.x + layout.width / 2);
  const snapOffsets = itemCenters.map((center) =>
    Math.round(Math.max(0, center - viewportWidth / 2)),
  );
  const first = layouts[0];
  const last = layouts[layouts.length - 1];
  const leadingInset = first.x;
  const trailingInset = Math.max(0, viewportWidth / 2 - last.width / 2);
  const contentWidth = last.x + last.width + trailingInset;

  return { leadingInset, trailingInset, itemCenters, snapOffsets, contentWidth };
}

function nearestIndexByFocal(scrollX: number, viewportWidth: number, itemCenters: number[]): number {
  if (!itemCenters.length || viewportWidth <= 0) {
    return 0;
  }
  const focalX = scrollX + viewportWidth / 2;
  let nearest = 0;
  let minDistance = Infinity;
  for (let index = 0; index < itemCenters.length; index += 1) {
    const distance = Math.abs(focalX - itemCenters[index]);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = index;
    }
  }
  return nearest;
}

function clampScrollOffset(offset: number, contentWidth: number, viewportWidth: number): number {
  const maxOffset = Math.max(0, contentWidth - viewportWidth);
  return Math.max(0, Math.min(offset, maxOffset));
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
        borderColor: 'transparent',
        backgroundColor: emphasized ? SwashoColors.surface : 'transparent',
        flexShrink: 0,
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
            flexShrink: 0,
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
  const serviceIndexRef = useRef(0);
  const serviceScrollOffsetRef = useRef(0);
  const serviceSnapIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serviceOffsetsAlignedRef = useRef(false);
  const committedGarmentIndexRef = useRef(initialGarmentIndex);

  const activeContext = garmentContexts[garmentIndex] ?? garmentContexts[0];
  const activeLine = activeContext?.line;
  const activeSlots = activeContext?.slots ?? [];
  const activeGarmentId = activeLine?.serviceId ?? '';
  const activeSlotKey = useMemo(
    () => activeSlots.map((slot) => slot.serviceId).join('|'),
    [activeSlots],
  );
  const serviceChipHeight = 35 * scale;
  const serviceChipGap = 8 * scale;
  const [serviceItemWidths, setServiceItemWidths] = useState<number[]>([]);
  const serviceMetricsRef = useRef<CenterSnapMetrics>({
    leadingInset: 0,
    trailingInset: 0,
    itemCenters: [],
    snapOffsets: [],
    contentWidth: 0,
  });
  const garmentMetricsRef = useRef<CenterSnapMetrics>({
    leadingInset: 0,
    trailingInset: 0,
    itemCenters: [],
    snapOffsets: [],
    contentWidth: 0,
  });
  const trackCarouselWidthRef = useRef(0);
  const serviceSnapInFlightRef = useRef(false);
  const garmentSnapInFlightRef = useRef(false);

  const appliedInitialServiceRef = useRef(false);

  useEffect(() => {
    setServiceItemWidths([]);
    serviceOffsetsAlignedRef.current = false;
  }, [activeSlotKey]);

  serviceIndexRef.current = serviceIndex;

  const resolvedServiceIndex = Math.min(
    serviceIndex,
    Math.max(0, activeSlots.length - 1),
  );
  trackCarouselWidthRef.current = trackCarouselWidth;

  const serviceWidthsReady =
    activeSlots.length > 0 &&
    activeSlots.every((_, index) => (serviceItemWidths[index] ?? 0) > 0);

  const serviceMetrics = useMemo(() => {
    if (!serviceWidthsReady || trackCarouselWidth <= 0) {
      return {
        leadingInset: 0,
        trailingInset: 0,
        itemCenters: [],
        snapOffsets: [],
        contentWidth: 0,
      };
    }
    const widths = activeSlots.map((_, index) => serviceItemWidths[index] ?? 0);
    return buildCenterSnapMetrics(trackCarouselWidth, widths, serviceChipGap);
  }, [activeSlots, serviceChipGap, serviceItemWidths, serviceWidthsReady, trackCarouselWidth]);

  serviceMetricsRef.current = serviceMetrics;

  const activeServiceChipWidth =
    serviceItemWidths[resolvedServiceIndex] && serviceItemWidths[resolvedServiceIndex] > 0
      ? serviceItemWidths[resolvedServiceIndex]
      : 112 * scale;

  const activeService = activeSlots[resolvedServiceIndex] ?? activeSlots[0];
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

  const garmentMetrics = useMemo(
    () =>
      buildCenterSnapMetrics(
        trackCarouselWidth,
        garmentContexts.map(() => garmentSnapStep),
        0,
      ),
    [garmentContexts.length, garmentSnapStep, trackCarouselWidth],
  );

  garmentMetricsRef.current = garmentMetrics;

  useEffect(() => {
    serviceOffsetsAlignedRef.current = false;
  }, [trackCarouselWidth, serviceMetrics.snapOffsets.join(',')]);

  const readServiceScrollOffset = useCallback((fallback = 0) => {
    const tracked = serviceScrollOffsetRef.current;
    if (Platform.OS === 'web') {
      const scrollable = (
        serviceScrollRef.current as unknown as { getScrollableNode?: () => HTMLElement }
      )?.getScrollableNode?.();
      const domOffset = scrollable?.scrollLeft ?? 0;
      if (domOffset > 0) {
        return domOffset;
      }
      if (fallback > 0) {
        return fallback;
      }
      return tracked;
    }
    return tracked > 0 ? tracked : fallback;
  }, []);

  const scrollServiceToOffset = useCallback((offsetX: number, animated: boolean) => {
    const viewport = trackCarouselWidthRef.current;
    const metrics = serviceMetricsRef.current;
    const clamped = clampScrollOffset(offsetX, metrics.contentWidth, viewport);
    serviceSnapInFlightRef.current = true;
    serviceScrollOffsetRef.current = clamped;
    if (Platform.OS === 'web') {
      const scrollable = (
        serviceScrollRef.current as unknown as { getScrollableNode?: () => HTMLElement }
      )?.getScrollableNode?.();
      scrollable?.scrollTo({ left: clamped, behavior: animated ? 'smooth' : 'auto' });
    } else {
      serviceScrollRef.current?.scrollTo({ x: clamped, animated });
    }
    setTimeout(() => {
      serviceSnapInFlightRef.current = false;
    }, animated ? 320 : 48);
  }, []);

  const scrollServiceToIndex = useCallback(
    (index: number, animated: boolean) => {
      const metrics = serviceMetricsRef.current;
      const targetX = metrics.snapOffsets[index];
      if (targetX === undefined) {
        return;
      }
      scrollServiceToOffset(targetX, animated);
    },
    [scrollServiceToOffset],
  );

  const snapServiceToNearest = useCallback(
    (offsetX: number, animated: boolean) => {
      if (serviceSnapInFlightRef.current) {
        return;
      }
      const viewport = trackCarouselWidthRef.current;
      const metrics = serviceMetricsRef.current;
      if (!metrics.snapOffsets.length || viewport <= 0) {
        return;
      }

      const index = nearestIndexByFocal(offsetX, viewport, metrics.itemCenters);
      const targetX = clampScrollOffset(
        metrics.snapOffsets[index],
        metrics.contentWidth,
        viewport,
      );

      setServiceIndex(index);
      serviceIndexRef.current = index;
      scrollServiceToOffset(targetX, animated);
    },
    [scrollServiceToOffset],
  );

  const handleServiceScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    serviceScrollOffsetRef.current = event.nativeEvent.contentOffset.x;
  }, []);

  const handleServiceScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const eventOffset = event.nativeEvent.contentOffset.x;
      serviceScrollOffsetRef.current = eventOffset;
      if (serviceSnapIdleTimerRef.current) {
        clearTimeout(serviceSnapIdleTimerRef.current);
      }
      const runSnap = () => {
        const offsetX = readServiceScrollOffset(eventOffset);
        snapServiceToNearest(offsetX, false);
      };
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => {
          requestAnimationFrame(runSnap);
        });
      } else {
        runSnap();
      }
    },
    [readServiceScrollOffset, snapServiceToNearest],
  );

  const scrollGarmentToIndex = useCallback(
    (index: number, animated: boolean) => {
      const metrics = garmentMetricsRef.current;
      const viewport = trackCarouselWidthRef.current;
      const targetX = metrics.snapOffsets[index];
      if (targetX === undefined) {
        return;
      }
      const clamped = clampScrollOffset(targetX, metrics.contentWidth, viewport);
      garmentSnapInFlightRef.current = true;
      garmentScrollRef.current?.scrollTo({ x: clamped, animated });
      if (Platform.OS === 'web') {
        const scrollable = (
          garmentScrollRef.current as unknown as { getScrollableNode?: () => HTMLElement }
        )?.getScrollableNode?.();
        scrollable?.scrollTo({ left: clamped, behavior: animated ? 'smooth' : 'auto' });
      }
      setTimeout(() => {
        garmentSnapInFlightRef.current = false;
      }, animated ? 320 : 48);
    },
    [],
  );

  const garmentInactiveScale = garmentInactiveInner / garmentActiveInner;

  const snapGarmentToNearest = useCallback(
    (offsetX: number, animated: boolean) => {
      if (garmentSnapInFlightRef.current) {
        return;
      }
      const viewport = trackCarouselWidthRef.current;
      const metrics = garmentMetricsRef.current;
      if (!metrics.snapOffsets.length || viewport <= 0) {
        return;
      }

      const index = nearestIndexByFocal(offsetX, viewport, metrics.itemCenters);
      const targetX = clampScrollOffset(metrics.snapOffsets[index], metrics.contentWidth, viewport);

      if (committedGarmentIndexRef.current !== index) {
        committedGarmentIndexRef.current = index;
        const slots = garmentContexts[index]?.slots ?? [];
        const maxService = Math.max(0, slots.length - 1);
        setServiceIndex((service) => {
          const next = Math.min(service, maxService);
          serviceIndexRef.current = next;
          return next;
        });
        serviceOffsetsAlignedRef.current = false;
        requestAnimationFrame(() => {
          const nextService = Math.min(serviceIndexRef.current, maxService);
          scrollServiceToIndex(nextService, false);
        });
      }
      setGarmentIndex(index);
      scrollGarmentToIndex(index, animated);
    },
    [garmentContexts, scrollGarmentToIndex, scrollServiceToIndex],
  );

  const handleServiceChipLayout = useCallback((index: number, event: LayoutChangeEvent) => {
    const width = Math.ceil(event.nativeEvent.layout.width);
    if (!width) {
      return;
    }
    setServiceItemWidths((previous) => {
      if (previous[index] === width) {
        return previous;
      }
      serviceOffsetsAlignedRef.current = false;
      const next = [...previous];
      next[index] = width;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!serviceWidthsReady || !serviceMetrics.snapOffsets.length || serviceOffsetsAlignedRef.current) {
      return;
    }
    serviceOffsetsAlignedRef.current = true;
    const idx = Math.min(serviceIndexRef.current, serviceMetrics.snapOffsets.length - 1);
    requestAnimationFrame(() => {
      scrollServiceToIndex(idx, false);
    });
  }, [serviceWidthsReady, serviceMetrics.snapOffsets.join(','), scrollServiceToIndex]);

  useEffect(() => {
    if (!activeSlots.length || appliedInitialServiceRef.current || !serviceMetrics.snapOffsets.length) {
      return;
    }
    const idx = activeSlots.findIndex((slot) => slot.serviceId === initialServiceId);
    const nextIndex = idx >= 0 ? idx : 0;
    appliedInitialServiceRef.current = true;
    setServiceIndex(nextIndex);
    scrollServiceToIndex(nextIndex, false);
  }, [activeSlots, initialServiceId, scrollServiceToIndex, serviceMetrics.snapOffsets.length]);

  useEffect(() => {
    if (!serviceMetrics.snapOffsets.length || serviceOffsetsAlignedRef.current) {
      return;
    }
    serviceOffsetsAlignedRef.current = true;
    const idx = Math.min(serviceIndexRef.current, serviceMetrics.snapOffsets.length - 1);
    scrollServiceToIndex(idx, false);
  }, [scrollServiceToIndex, serviceMetrics.snapOffsets]);

  useEffect(() => {
    return () => {
      if (serviceSnapIdleTimerRef.current) {
        clearTimeout(serviceSnapIdleTimerRef.current);
      }
    };
  }, []);

  const handleGarmentScroll = useCallback(() => {
    // Selection updates only after snap settles (drag / momentum end).
  }, []);

  const handleServiceScrollBegin = useCallback(() => {
    if (serviceSnapIdleTimerRef.current) {
      clearTimeout(serviceSnapIdleTimerRef.current);
    }
    serviceSnapInFlightRef.current = false;
  }, []);

  const handleGarmentScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const eventOffset = event.nativeEvent.contentOffset.x;
      const runSnap = () => snapGarmentToNearest(eventOffset, Platform.OS !== 'web');
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => {
          requestAnimationFrame(runSnap);
        });
      } else {
        runSnap();
      }
    },
    [snapGarmentToNearest],
  );

  useEffect(() => {
    const index = Math.max(
      0,
      garmentContexts.findIndex((ctx) => ctx.line.serviceId === initialGarmentId),
    );
    const frame = requestAnimationFrame(() => {
      scrollGarmentToIndex(index, false);
      setGarmentIndex(index);
      committedGarmentIndexRef.current = index;
    });
    return () => cancelAnimationFrame(frame);
  }, [
    garmentContexts.length,
    garmentMetrics.snapOffsets.join(','),
    initialGarmentId,
    scrollGarmentToIndex,
  ]);

  useEffect(() => {
    if (!garmentMetrics.snapOffsets.length) {
      return;
    }
    const idx = Math.min(committedGarmentIndexRef.current, garmentMetrics.snapOffsets.length - 1);
    scrollGarmentToIndex(idx, false);
  }, [garmentMetrics.snapOffsets, scrollGarmentToIndex]);

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
            {trackCarouselWidth > 0 ? (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: trackCarouselWidth / 2 - activeServiceChipWidth / 2,
                  top: 0,
                  width: activeServiceChipWidth,
                  height: serviceChipHeight,
                  zIndex: 2,
                }}>
                <ServiceCarouselCenterFrame scale={scale} />
              </View>
            ) : null}
            <ScrollView
              ref={serviceScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToOffsets={
                Platform.OS === 'web' || !serviceMetrics.snapOffsets.length
                  ? undefined
                  : serviceMetrics.snapOffsets
              }
              snapToAlignment="start"
              disableIntervalMomentum
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={handleServiceScroll}
              onScrollBeginDrag={handleServiceScrollBegin}
              onMomentumScrollEnd={handleServiceScrollEnd}
              onScrollEndDrag={handleServiceScrollEnd}
              style={[
                { width: '100%', maxHeight: serviceChipHeight },
                Platform.OS === 'web'
                  ? ({ overflowX: 'auto', touchAction: 'pan-x', overscrollBehaviorX: 'contain' } as object)
                  : null,
              ]}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                minHeight: serviceChipHeight,
              }}>
              <View style={{ width: serviceMetrics.leadingInset, flexShrink: 0 }} />
              {activeSlots.map((slot, index) => {
                const isCentered = index === resolvedServiceIndex;
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
                        height: serviceChipHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: index < activeSlots.length - 1 ? serviceChipGap : 0,
                      },
                      Platform.OS === 'web' ? ({ touchAction: 'pan-x', cursor: 'grab' } as object) : null,
                    ]}>
                    <View onLayout={(event) => handleServiceChipLayout(index, event)}>
                      <View style={{ transform: [{ scale: isCentered ? 1 : 0.94 }] }}>
                        <ServiceCarouselChip scale={scale} slot={slot} emphasized={isCentered} />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
              <View style={{ width: serviceMetrics.trailingInset, flexShrink: 0 }} />
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
                left: trackCarouselWidth / 2 - garmentRingSize / 2,
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
              snapToOffsets={garmentMetrics.snapOffsets}
              snapToAlignment="start"
              disableIntervalMomentum
              decelerationRate="fast"
              scrollEventThrottle={16}
              onScroll={handleGarmentScroll}
              onMomentumScrollEnd={handleGarmentScrollEnd}
              onScrollEndDrag={handleGarmentScrollEnd}
              style={[
                { width: '100%' },
                Platform.OS === 'web'
                  ? ({
                      overflowX: 'auto',
                      touchAction: 'pan-x',
                      overscrollBehaviorX: 'contain',
                    } as object)
                  : null,
              ]}
              contentContainerStyle={{
                alignItems: 'center',
                minHeight: garmentRingSize,
              }}>
              <View style={{ width: garmentMetrics.leadingInset, flexShrink: 0 }} />
              {garmentContexts.map((ctx, index) => {
                const isCentered = index === garmentIndex;
                const iconW = (isCentered ? 40 : 28) * scale;
                const iconH = (isCentered ? 43 : 25) * scale;
                return (
                  <Pressable
                    key={ctx.line.serviceId}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isCentered }}
                    accessibilityLabel={
                      isCentered
                        ? `Capture photo for ${activeService?.title ?? 'service'}`
                        : `Select ${ctx.line.title}`
                    }
                    delayPressIn={isCentered ? 220 : 80}
                    onPress={() => {
                      if (isCentered) {
                        void handleUploadPress();
                        return;
                      }
                      committedGarmentIndexRef.current = index;
                      setGarmentIndex(index);
                      const slots = garmentContexts[index]?.slots ?? [];
                      setServiceIndex((service) => Math.min(service, Math.max(0, slots.length - 1)));
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
                        ? ({
                            outlineStyle: 'none',
                            outlineWidth: 0,
                            touchAction: 'pan-x',
                            cursor: 'grab',
                          } as object)
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
                        borderWidth: 0,
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
              <View style={{ width: garmentMetrics.trailingInset, flexShrink: 0 }} />
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
