import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

export const SUBSCRIBE_BANNER_ACCENT_CYCLE_MS = 1000;
export const SUBSCRIBE_BANNER_ACCENT_PAUSE_MS = 500;
export const SUBSCRIBE_BANNER_ACCENT_CYCLES = 3;

function readWebReducedMotion(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeInOutCubic(t: number): number {
  if (t <= 0) {
    return 0;
  }
  if (t >= 1) {
    return 1;
  }
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function accentProgressForElapsed(elapsedMs: number): { value: number; finished: boolean } {
  let remaining = elapsedMs;

  for (let cycle = 0; cycle < SUBSCRIBE_BANNER_ACCENT_CYCLES; cycle += 1) {
    if (remaining < SUBSCRIBE_BANNER_ACCENT_CYCLE_MS) {
      return {
        value: easeInOutCubic(remaining / SUBSCRIBE_BANNER_ACCENT_CYCLE_MS),
        finished: false,
      };
    }
    remaining -= SUBSCRIBE_BANNER_ACCENT_CYCLE_MS;

    if (remaining < SUBSCRIBE_BANNER_ACCENT_PAUSE_MS) {
      return { value: 1, finished: false };
    }
    remaining -= SUBSCRIBE_BANNER_ACCENT_PAUSE_MS;
  }

  return { value: 1, finished: true };
}

type UseSubscribeBannerAccentAnimationResult = {
  accentProgress: number;
  isStaticAccent: boolean;
};

export function useSubscribeBannerAccentAnimation(
  sessionId: number,
): UseSubscribeBannerAccentAnimationResult {
  const [accentProgress, setAccentProgress] = useState(0);
  const [completedSessionId, setCompletedSessionId] = useState(0);
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

  const shouldRunAnimation = !reduceMotion && sessionId > 0;
  const isStaticAccent = reduceMotion || sessionId < 1 || completedSessionId === sessionId;

  useEffect(() => {
    if (!shouldRunAnimation) {
      return;
    }

    const sessionAtStart = sessionId;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const { value, finished } = accentProgressForElapsed(now - startTime);
      setAccentProgress(value);

      if (finished) {
        setCompletedSessionId(sessionAtStart);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [shouldRunAnimation, sessionId]);

  if (reduceMotion) {
    return { accentProgress: 0, isStaticAccent: true };
  }

  return { accentProgress, isStaticAccent };
}
