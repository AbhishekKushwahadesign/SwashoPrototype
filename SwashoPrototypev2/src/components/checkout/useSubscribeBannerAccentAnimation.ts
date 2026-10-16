import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export const SUBSCRIBE_BANNER_ACCENT_CYCLE_MS = 1000;
export const SUBSCRIBE_BANNER_ACCENT_PAUSE_MS = 750;
export const SUBSCRIBE_BANNER_ACCENT_CYCLES = 3;

function readWebReducedMotion(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type UseSubscribeBannerAccentAnimationResult = {
  accentProgress: number;
  isStaticAccent: boolean;
};

export function useSubscribeBannerAccentAnimation(
  sessionId: number,
): UseSubscribeBannerAccentAnimationResult {
  const progress = useSharedValue(0);
  const [accentProgress, setAccentProgress] = useState(0);
  const [isStaticAccent, setIsStaticAccent] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(readWebReducedMotion);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        setReduceMotion(value || readWebReducedMotion());
      })
      .catch(() => {
        setReduceMotion(readWebReducedMotion());
      });

    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = () => {
        setReduceMotion(media.matches);
      };
      media.addEventListener('change', onChange);
      subscription = { remove: () => media.removeEventListener('change', onChange) };
    }

    return () => {
      subscription?.remove();
    };
  }, []);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(setAccentProgress)(value);
    },
    [sessionId],
  );

  useEffect(() => {
    if (reduceMotion || sessionId < 1) {
      cancelAnimation(progress);
      progress.value = 0;
      setAccentProgress(0);
      setIsStaticAccent(true);
      return;
    }

    setIsStaticAccent(false);
    setAccentProgress(0);
    progress.value = 0;

    const markStatic = () => {
      setIsStaticAccent(true);
    };

    const easing = Easing.inOut(Easing.cubic);
    const animateIn = withTiming(1, { duration: SUBSCRIBE_BANNER_ACCENT_CYCLE_MS, easing });
    const pauseThenReset = withDelay(
      SUBSCRIBE_BANNER_ACCENT_PAUSE_MS,
      withTiming(0, { duration: 0 }),
    );
    const pauseThenHold = withDelay(
      SUBSCRIBE_BANNER_ACCENT_PAUSE_MS,
      withTiming(1, { duration: 0 }, (finished) => {
        if (finished) {
          runOnJS(markStatic)();
        }
      }),
    );

    const cycleWithReset = withSequence(animateIn, pauseThenReset);
    const finalCycle = withSequence(animateIn, pauseThenHold);

    progress.value = withSequence(cycleWithReset, cycleWithReset, finalCycle);

    return () => {
      cancelAnimation(progress);
    };
  }, [progress, reduceMotion, sessionId]);

  if (reduceMotion) {
    return { accentProgress: 0, isStaticAccent: true };
  }

  return { accentProgress, isStaticAccent };
}
