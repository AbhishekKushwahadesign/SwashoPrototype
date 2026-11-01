import { useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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
  useWindowDimensions,
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
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SwashoColors } from '@/constants/swasho-tokens';
import { useProviderCart } from '@/context/provider-cart-context';
import { buildCheckoutBasketGroups, type CheckoutBasketLine } from '@/lib/build-checkout-basket';
import { getProviderGarmentName } from '@/data/providers';
import { checkoutPlaceholderHref } from '@/lib/checkout-flow';
import {
  basketGarmentThumbVariant,
  garmentBasketPhotoSatisfied,
  garmentPhotoProgressFraction,
  garmentPhotoSlotsFromBasketLine,
  garmentPhotoUploadHint,
  garmentPhotoUploadMandatory,
  type GarmentPhotoServiceSlot,
} from '@/lib/contactless-garment-photos';
import { CheckoutGarmentThumbIcon, CheckoutInfoIcon } from './checkout-review-icons';
import {
  ContactlessCameraPlaceholderIcon,
  ContactlessUploadMinimalisticIcon,
} from './contactless-basket-photo-icons';
import { ContactlessHowItWorksModal } from './ContactlessHowItWorksModal';
import { ContactlessRequiredPhotoSuccessModal } from './ContactlessRequiredPhotoSuccessModal';
import { demoGarmentPhotoUriForSlot } from '@/lib/demo-garment-photo-uri';

/** Figma 3399:16791 — reference garment on hanger (not contactless workflow art). */
const DEFAULT_GARMENT_HERO = require('@/assets/checkout/garment-photo-upload-hero.png');
const STATUS_BAR_HEIGHT = 32;
const BOTTOM_PANEL_HEIGHT = 310;
/** Figma 3399:16792 — header chrome band (412×93, y=-9) over hero. */
const HEADER_CHROME_TOP_FIGMA = -9;
const HEADER_CHROME_HEIGHT_FIGMA = 93;
/** Figma 59321:3683 — camera preview scrim below header chrome. */
const CAMERA_OVERLAY_TOP_FIGMA = 84;
const CAMERA_OVERLAY_HEIGHT_FIGMA = 536;
const UPLOAD_THUMB_SIZE_FIGMA = 45;
const UPLOAD_THUMB_RADIUS_FIGMA = 4.8;
/** Figma 3399:16790 — footer / hint panel fill (neutral beige). */
const BOTTOM_PANEL_BG = '#f5f0e8';

/** Dev / QA fixture — six distinct service widths (contactless multi-service garment). */
const SNAP_TEST_MULTI_SERVICE_SLOTS: GarmentPhotoServiceSlot[] = [
  { serviceId: 'wash-iron', title: 'Wash & Iron', quantity: 1, optional: false },
  { serviceId: 'ironing-basic', title: 'Ironing', quantity: 1, optional: false },
  { serviceId: 'wash-fold', title: 'Wash & fold', quantity: 2, optional: false },
  { serviceId: 'pressing-ironing', title: 'Ironing', quantity: 1, optional: false },
  { serviceId: 'dry-cleaning', title: 'Dry Cleaning', quantity: 2, optional: false },
  { serviceId: 'stain-removal', title: 'Stain removal', quantity: 1, optional: false },
];
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

function ServiceCarouselCenterFill({ scale }: { scale: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 20 * scale,
        backgroundColor: SwashoColors.surface,
      }}
    />
  );
}

function ServiceCarouselCenterBorder({ scale }: { scale: number }) {
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

  const snapOffsets = itemCenters.map((center) =>
    Math.round(Math.max(0, center - viewportWidth / 2)),
  );
  const itemsWidth = itemWidths.reduce(
    (sum, width, index) => sum + width + (index < itemWidths.length - 1 ? itemGap : 0),
    0,
  );
  const contentWidth = leadingInset + itemsWidth + trailingInset;

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
        backgroundColor: 'transparent',
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
            color: emphasized ? SwashoColors.darkHeaderText : SwashoColors.neutral700,
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
              color: emphasized ? SwashoColors.darkHeaderText : SwashoColors.neutral700,
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
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const { getProviderCartEntries, getSelection, getContactlessGarmentPhotos, addContactlessGarmentPhoto } =
    useProviderCart();
  const [guideVisible, setGuideVisible] = useState(false);
  const [requiredPhotoSuccessVisible, setRequiredPhotoSuccessVisible] = useState(false);
  const [inlineSaveCtaGarmentIds, setInlineSaveCtaGarmentIds] = useState<Set<string>>(() => new Set());
  const requiredPhotoModalShownRef = useRef<Set<string>>(new Set());

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
    if (query === 'snap-test') {
      return [{ line: fallbackLine, slots: SNAP_TEST_MULTI_SERVICE_SLOTS }];
    }
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
  const garmentScrollOffsetRef = useRef(0);
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
  /** Figma 59184:5461 — 16px between service capsules */
  const serviceChipGap = 16 * scale;
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

  const serviceChipWidthFallback = useMemo(() => {
    const measured = serviceItemWidths.filter((width) => width > 0);
    const maxMeasured = measured.length ? Math.max(...measured) : 0;
    return Math.max(144 * scale, maxMeasured);
  }, [scale, serviceItemWidths]);

  const serviceItemWidthAt = useCallback(
    (index: number) => {
      const measured = serviceItemWidths[index];
      return measured && measured > 0 ? measured : serviceChipWidthFallback;
    },
    [serviceChipWidthFallback, serviceItemWidths],
  );

  const serviceMetrics = useMemo(() => {
    if (!activeSlots.length || trackCarouselWidth <= 0 || serviceChipWidthFallback <= 0) {
      return {
        leadingInset: 0,
        trailingInset: 0,
        itemCenters: [],
        snapOffsets: [],
        contentWidth: 0,
      };
    }
    const widths = activeSlots.map((_, index) => serviceItemWidthAt(index));
    return buildCenterSnapMetrics(trackCarouselWidth, widths, serviceChipGap);
  }, [activeSlots, serviceChipGap, serviceChipWidthFallback, serviceItemWidthAt, trackCarouselWidth]);

  serviceMetricsRef.current = serviceMetrics;

  /** Center overlay hugs the active chip width. */
  const serviceCenterFrameWidth = useMemo(() => {
    return serviceItemWidthAt(resolvedServiceIndex);
  }, [resolvedServiceIndex, serviceItemWidthAt]);

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

  const handleSaveAndGoToCart = useCallback(() => {
    setRequiredPhotoSuccessVisible(false);
    router.replace(checkoutPlaceholderHref(providerId, query, {}));
  }, [providerId, query, router]);

  const handleUploadPress = useCallback(() => {
    if (!activeLine || !activeService) {
      return;
    }
    const captureGarmentId = activeLine.serviceId;
    const captureServiceId = activeService.serviceId;
    const captureSlots = activeSlots;
    const wasSatisfied = garmentBasketPhotoSatisfied(photoStore, captureGarmentId, captureSlots);
    const uri = demoGarmentPhotoUriForSlot(captureGarmentId, captureServiceId);
    addContactlessGarmentPhoto(providerId, captureGarmentId, captureServiceId, uri);
    const nextStore = {
      ...photoStore,
      [captureGarmentId]: {
        ...(photoStore[captureGarmentId] ?? {}),
        [captureServiceId]: [...(photoStore[captureGarmentId]?.[captureServiceId] ?? []), uri],
      },
    };
    const nowSatisfied = garmentBasketPhotoSatisfied(nextStore, captureGarmentId, captureSlots);
    if (
      garmentPhotoUploadMandatory(captureSlots) &&
      !wasSatisfied &&
      nowSatisfied &&
      !requiredPhotoModalShownRef.current.has(captureGarmentId)
    ) {
      requiredPhotoModalShownRef.current.add(captureGarmentId);
      setRequiredPhotoSuccessVisible(true);
    }
  }, [activeLine, activeService, activeSlots, addContactlessGarmentPhoto, photoStore, providerId]);

  const handleRequiredPhotoUploadMore = useCallback(() => {
    setRequiredPhotoSuccessVisible(false);
    if (activeGarmentId) {
      setInlineSaveCtaGarmentIds((previous) => {
        if (previous.has(activeGarmentId)) {
          return previous;
        }
        const next = new Set(previous);
        next.add(activeGarmentId);
        return next;
      });
    }
  }, [activeGarmentId]);

  const activeGarmentPhotoSatisfied = useMemo(
    () => garmentBasketPhotoSatisfied(photoStore, activeGarmentId, activeSlots),
    [activeGarmentId, activeSlots, photoStore],
  );

  const showInlineSaveAndGoCart =
    activeGarmentPhotoSatisfied && inlineSaveCtaGarmentIds.has(activeGarmentId);

  const showGoToCheckoutCta =
    !garmentPhotoUploadMandatory(activeSlots) && !showInlineSaveAndGoCart;

  const garmentRingSize = 81 * scale;
  const garmentActiveInner = 71 * scale;
  const garmentInactiveInner = 56 * scale;
  const garmentSnapStep = garmentRingSize;
  /** Figma 3399:16790 — edge gap between garment rings (~28px at 412pt artboard). */
  const garmentChipGap = 28 * scale;

  const garmentMetrics = useMemo(
    () =>
      buildCenterSnapMetrics(
        trackCarouselWidth,
        garmentContexts.map(() => garmentSnapStep),
        garmentChipGap,
      ),
    [garmentChipGap, garmentContexts.length, garmentSnapStep, trackCarouselWidth],
  );

  garmentMetricsRef.current = garmentMetrics;

  useEffect(() => {
    serviceOffsetsAlignedRef.current = false;
  }, [trackCarouselWidth, serviceMetrics.snapOffsets.join(',')]);

  const getScrollableNode = useCallback((ref: RefObject<ScrollView | null>) => {
    return (ref.current as unknown as { getScrollableNode?: () => HTMLElement })?.getScrollableNode?.();
  }, []);

  const readServiceScrollOffset = useCallback((fallback = 0) => {
    if (Platform.OS === 'web') {
      const scrollable = getScrollableNode(serviceScrollRef);
      if (scrollable) {
        return scrollable.scrollLeft;
      }
    }
    const tracked = serviceScrollOffsetRef.current;
    return Number.isFinite(tracked) ? tracked : fallback;
  }, [getScrollableNode]);

  const readGarmentScrollOffset = useCallback((fallback = 0) => {
    if (Platform.OS === 'web') {
      const scrollable = getScrollableNode(garmentScrollRef);
      if (scrollable) {
        return scrollable.scrollLeft;
      }
    }
    const tracked = garmentScrollOffsetRef.current;
    return Number.isFinite(tracked) ? tracked : fallback;
  }, [getScrollableNode]);

  const scrollServiceToOffset = useCallback((offsetX: number, animated: boolean) => {
    const viewport = trackCarouselWidthRef.current;
    const metrics = serviceMetricsRef.current;
    const clamped = clampScrollOffset(offsetX, metrics.contentWidth, viewport);
    serviceSnapInFlightRef.current = true;
    serviceScrollOffsetRef.current = clamped;
    if (Platform.OS === 'web') {
      const scrollable = getScrollableNode(serviceScrollRef);
      if (scrollable) {
        // RN Web horizontal ScrollView ignores scrollTo({ left }) on the scroll node.
        scrollable.scrollLeft = clamped;
      }
    } else {
      serviceScrollRef.current?.scrollTo({ x: clamped, animated });
    }
    setTimeout(() => {
      serviceSnapInFlightRef.current = false;
    }, animated ? 320 : 48);
  }, [getScrollableNode]);

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
      if (Math.abs(offsetX - targetX) < 1) {
        serviceScrollOffsetRef.current = targetX;
        return;
      }
      scrollServiceToOffset(targetX, animated);
    },
    [scrollServiceToOffset],
  );

  const handleServiceScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (serviceSnapInFlightRef.current) {
      return;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    serviceScrollOffsetRef.current = offsetX;
    const viewport = trackCarouselWidthRef.current;
    const metrics = serviceMetricsRef.current;
    if (!metrics.itemCenters.length || viewport <= 0) {
      return;
    }
    const previewIndex = nearestIndexByFocal(offsetX, viewport, metrics.itemCenters);
    setServiceIndex((prev) => (prev === previewIndex ? prev : previewIndex));
    serviceIndexRef.current = previewIndex;
  }, []);

  const settleServiceSnap = useCallback(() => {
    serviceSnapInFlightRef.current = false;
    const offsetX = readServiceScrollOffset();
    snapServiceToNearest(offsetX, false);
  }, [readServiceScrollOffset, snapServiceToNearest]);

  const handleServiceScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      serviceScrollOffsetRef.current = event.nativeEvent.contentOffset.x;
      if (serviceSnapIdleTimerRef.current) {
        clearTimeout(serviceSnapIdleTimerRef.current);
      }
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => {
          requestAnimationFrame(settleServiceSnap);
        });
      } else {
        settleServiceSnap();
      }
    },
    [settleServiceSnap],
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
      garmentScrollOffsetRef.current = clamped;
      if (Platform.OS === 'web') {
        const scrollable = getScrollableNode(garmentScrollRef);
        if (scrollable) {
          scrollable.scrollLeft = clamped;
        }
      } else {
        garmentScrollRef.current?.scrollTo({ x: clamped, animated });
      }
      setTimeout(() => {
        garmentSnapInFlightRef.current = false;
      }, animated ? 320 : 48);
    },
    [getScrollableNode],
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
    if (!serviceMetrics.snapOffsets.length || serviceOffsetsAlignedRef.current) {
      return;
    }
    serviceOffsetsAlignedRef.current = true;
    const idx = Math.min(serviceIndexRef.current, serviceMetrics.snapOffsets.length - 1);
    requestAnimationFrame(() => {
      scrollServiceToIndex(idx, false);
    });
  }, [serviceMetrics.snapOffsets.join(','), scrollServiceToIndex]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !serviceMetrics.snapOffsets.length) {
      return;
    }
    const scrollable = getScrollableNode(serviceScrollRef);
    if (!scrollable) {
      return;
    }
    const onScrollEnd = () => {
      settleServiceSnap();
    };
    scrollable.addEventListener('scrollend', onScrollEnd);
    return () => {
      scrollable.removeEventListener('scrollend', onScrollEnd);
    };
  }, [getScrollableNode, serviceMetrics.snapOffsets.join(','), settleServiceSnap]);

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
    return () => {
      if (serviceSnapIdleTimerRef.current) {
        clearTimeout(serviceSnapIdleTimerRef.current);
      }
    };
  }, []);

  const settleGarmentSnap = useCallback(() => {
    garmentSnapInFlightRef.current = false;
    const offsetX = readGarmentScrollOffset();
    snapGarmentToNearest(offsetX, false);
  }, [readGarmentScrollOffset, snapGarmentToNearest]);

  const handleGarmentScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (garmentSnapInFlightRef.current) {
      return;
    }
    const offsetX = event.nativeEvent.contentOffset.x;
    garmentScrollOffsetRef.current = offsetX;
    const viewport = trackCarouselWidthRef.current;
    const metrics = garmentMetricsRef.current;
    if (!metrics.itemCenters.length || viewport <= 0) {
      return;
    }
    const previewIndex = nearestIndexByFocal(offsetX, viewport, metrics.itemCenters);
    setGarmentIndex((prev) => (prev === previewIndex ? prev : previewIndex));
  }, []);

  const handleServiceScrollBegin = useCallback(() => {
    if (serviceSnapIdleTimerRef.current) {
      clearTimeout(serviceSnapIdleTimerRef.current);
    }
    serviceSnapInFlightRef.current = false;
  }, []);

  const handleGarmentScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      garmentScrollOffsetRef.current = event.nativeEvent.contentOffset.x;
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => {
          requestAnimationFrame(settleGarmentSnap);
        });
      } else {
        settleGarmentSnap();
      }
    },
    [settleGarmentSnap],
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || !garmentMetrics.snapOffsets.length) {
      return;
    }
    const scrollable = getScrollableNode(garmentScrollRef);
    if (!scrollable) {
      return;
    }
    const onScrollEnd = () => {
      settleGarmentSnap();
    };
    scrollable.addEventListener('scrollend', onScrollEnd);
    return () => {
      scrollable.removeEventListener('scrollend', onScrollEnd);
    };
  }, [garmentMetrics.snapOffsets.join(','), getScrollableNode, settleGarmentSnap]);

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

  const headerChromeTop = safeTop + HEADER_CHROME_TOP_FIGMA * scale;
  const headerChromeHeight = HEADER_CHROME_HEIGHT_FIGMA * scale;
  const cameraOverlayTop = safeTop + CAMERA_OVERLAY_TOP_FIGMA * scale;
  const bottomPanelTotal = bottomPanelHeight + insets.bottom;
  const panelTopY = windowHeight - bottomPanelTotal;
  const maxCameraOverlayHeight = Math.max(0, panelTopY - cameraOverlayTop);
  const cameraOverlayHeight = Math.min(CAMERA_OVERLAY_HEIGHT_FIGMA * scale, maxCameraOverlayHeight);
  const uploadThumbSize = UPLOAD_THUMB_SIZE_FIGMA * scale;
  const uploadThumbRadius = UPLOAD_THUMB_RADIUS_FIGMA * scale;

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.heroRegion,
          {
            top: headerChromeTop,
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

      <LinearGradient
        pointerEvents="none"
        colors={['#FFFFFF', '#FFFFFF', 'rgba(255,255,255,0)']}
        locations={[0, STATUS_BAR_HEIGHT / HEADER_CHROME_HEIGHT_FIGMA, 0.72]}
        style={[
          styles.headerBackdrop,
          {
            top: headerChromeTop,
            height: headerChromeHeight,
          },
          Platform.OS === 'web' ? ({ backdropFilter: 'blur(4px)' } as object) : null,
        ]}
      />

      <View
        pointerEvents="box-none"
        style={[
          styles.cameraOverlay,
          {
            top: cameraOverlayTop,
            height: cameraOverlayHeight,
          },
        ]}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10 * scale,
            gap: 12 * scale,
          }}>
          <ContactlessCameraPlaceholderIcon width={47 * scale} height={47 * scale} />
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 14 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.surface,
                textAlign: 'center',
                maxWidth: 208 * scale,
              },
            ]}>
            Camera previews will appear here
          </Text>
        </View>
        {activePhotos.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8 * scale,
              paddingLeft: 22 * scale,
              paddingBottom: 11 * scale,
            }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
            {activePhotos.map((uri) => (
              <Image
                key={uri}
                source={{ uri }}
                style={{
                  width: uploadThumbSize,
                  height: uploadThumbSize,
                  borderRadius: uploadThumbRadius,
                }}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <View
        style={[
          styles.statusBar,
          {
            top: safeTop,
            height: STATUS_BAR_HEIGHT * scale,
            backgroundColor: SwashoColors.surface,
          },
        ]}>
        <SearchStatusBar scale={scale} backgroundColor={SwashoColors.surface} />
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
            height: bottomPanelTotal,
            paddingTop: 12 * scale,
            paddingBottom: insets.bottom,
            backgroundColor: BOTTOM_PANEL_BG,
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
                  color: SwashoColors.neutral800,
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
              <>
                <View
                  pointerEvents="none"
                  style={[
                    {
                      position: 'absolute',
                      left: trackCarouselWidth / 2 - serviceCenterFrameWidth / 2,
                      top: 0,
                      width: serviceCenterFrameWidth,
                      height: serviceChipHeight,
                      zIndex: 1,
                    },
                    Platform.OS === 'web'
                      ? ({
                          transitionProperty: 'width, left',
                          transitionDuration: '220ms',
                          transitionTimingFunction: 'ease',
                        } as object)
                      : null,
                  ]}>
                  <ServiceCarouselCenterFill scale={scale} />
                </View>
                <View
                  pointerEvents="none"
                  style={[
                    {
                      position: 'absolute',
                      left: trackCarouselWidth / 2 - serviceCenterFrameWidth / 2,
                      top: 0,
                      width: serviceCenterFrameWidth,
                      height: serviceChipHeight,
                      zIndex: 3,
                    },
                    Platform.OS === 'web'
                      ? ({
                          transitionProperty: 'width, left',
                          transitionDuration: '220ms',
                          transitionTimingFunction: 'ease',
                        } as object)
                      : null,
                  ]}>
                  <ServiceCarouselCenterBorder scale={scale} />
                </View>
              </>
            ) : null}
            <ScrollView
              ref={serviceScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToOffsets={
                Platform.OS !== 'web' && serviceMetrics.snapOffsets.length
                  ? serviceMetrics.snapOffsets
                  : undefined
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
                {
                  width: '100%',
                  maxHeight: serviceChipHeight,
                  zIndex: 2,
                  position: 'relative',
                },
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
                        width: serviceItemWidthAt(index),
                        height: serviceChipHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginRight: index < activeSlots.length - 1 ? serviceChipGap : 0,
                      },
                      Platform.OS === 'web' ? ({ touchAction: 'pan-x', cursor: 'grab' } as object) : null,
                    ]}>
                    <View
                      onLayout={(event) => handleServiceChipLayout(index, event)}
                      style={{ opacity: isCentered ? 1 : 0.72 }}>
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
                        marginRight:
                          index < garmentContexts.length - 1 ? garmentChipGap : 0,
                      },
                      Platform.OS === 'web'
                        ? ({
                            outlineStyle: 'none',
                            outlineWidth: 0,
                            borderStyle: 'none',
                            borderWidth: 0,
                            touchAction: 'pan-x',
                            cursor: 'grab',
                          } as object)
                        : { borderWidth: 0 },
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

          {showInlineSaveAndGoCart ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10 * scale,
                paddingHorizontal: 20 * scale,
                marginTop: 'auto',
                paddingVertical: 10 * scale,
                paddingBottom: 32 * scale,
              }}>
              <ServiceSelectionButton
                label="Upload"
                variant="secondary"
                scale={scale}
                onPress={handleUploadPress}
                leadingIcon={<ContactlessUploadMinimalisticIcon width={20 * scale} height={20 * scale} />}
                style={{ width: 122 * scale, flexShrink: 0 }}
              />
              <ServiceSelectionButton
                label="Save & Go to cart"
                variant="primary"
                scale={scale}
                onPress={handleSaveAndGoToCart}
                style={{ flex: 1 }}
              />
            </View>
          ) : (
            <View
              style={{
                marginTop: 'auto',
                paddingHorizontal: 20 * scale,
                paddingBottom: 32 * scale,
                gap: 12 * scale,
              }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Upload"
                onPress={handleUploadPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10 * scale,
                  height: 45 * scale,
                  paddingHorizontal: 10 * scale,
                  borderRadius: 8 * scale,
                  backgroundColor: SwashoColors.surface,
                  alignSelf: 'flex-start',
                }}>
                <ContactlessUploadMinimalisticIcon width={20 * scale} height={20 * scale} />
                <Text
                  style={[
                    searchFont('semibold'),
                    {
                      fontSize: 16 * scale,
                      lineHeight: 14 * scale,
                      letterSpacing: 0.5 * scale,
                      color: SwashoColors.primary600,
                    },
                  ]}>
                  Upload
                </Text>
              </Pressable>
              {showGoToCheckoutCta ? (
                <ServiceSelectionButton
                  label="Go to checkout"
                  variant="primary"
                  scale={scale}
                  onPress={handleSaveAndGoToCart}
                  style={{ alignSelf: 'stretch' }}
                />
              ) : null}
            </View>
          )}
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

      <ContactlessRequiredPhotoSuccessModal
        visible={requiredPhotoSuccessVisible}
        scale={scale}
        onSaveAndGoToCart={handleSaveAndGoToCart}
        onUploadMore={handleRequiredPhotoUploadMore}
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
  headerBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 12,
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
  cameraOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    zIndex: 8,
    overflow: 'hidden',
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
