import { useCallback, useEffect, useRef, useState } from 'react';

import { analyzeGarment, type GarmentAnalysisResult } from '@/lib/ai-garment-analysis';
import { detectGarment } from '@/lib/ai-garment-detection';

export type GarmentScanPhase =
  | 'permission'
  | 'initializing'
  | 'preview'
  | 'detecting'
  | 'capturing'
  | 'analyzing'
  | 'success'
  | 'failed'
  | 'retake';

type UseGarmentScanFlowOptions = {
  permissionGranted: boolean | null;
  permissionDenied: boolean;
  cameraUnavailable: boolean;
  onRequestPermission: () => void;
};

export function useGarmentScanFlow({
  permissionGranted,
  permissionDenied,
  cameraUnavailable,
  onRequestPermission,
}: UseGarmentScanFlowOptions) {
  const [phase, setPhase] = useState<GarmentScanPhase>('permission');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<GarmentAnalysisResult | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [detectionNotice, setDetectionNotice] = useState<string | null>(null);

  const captureLockRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const cancelAsync = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cancelAsync();
    };
  }, [cancelAsync]);

  useEffect(() => {
    if (cameraUnavailable) {
      setPhase('failed');
      setFailureMessage('Camera is not available on this device.');
      return;
    }

    if (permissionGranted === null) {
      setPhase('permission');
      return;
    }

    if (permissionDenied) {
      setPhase('permission');
      return;
    }

    if (permissionGranted && phase === 'permission') {
      setPhase('initializing');
    }
  }, [cameraUnavailable, permissionDenied, permissionGranted, phase]);

  const onCameraReady = useCallback(async () => {
    if (phase !== 'initializing') {
      return;
    }

    setPhase('detecting');
    setDetectionNotice(null);
    const controller = new AbortController();
    abortRef.current = controller;

    const detection = await detectGarment(undefined, { signal: controller.signal });
    if (controller.signal.aborted) {
      return;
    }

    if (!detection.ready) {
      setDetectionNotice(detection.reason);
    }
    setPhase('preview');
  }, [phase]);

  const capturePhoto = useCallback(
    async (takePicture: () => Promise<string | null>) => {
      if (captureLockRef.current || phase !== 'preview') {
        return;
      }
      captureLockRef.current = true;
      setPhase('capturing');

      try {
        const uri = await takePicture();
        if (!uri) {
          setPhase('preview');
          return;
        }

        setCapturedUri(uri);
        setPhase('analyzing');
        setFailureMessage(null);
        setAnalysisResult(null);

        const controller = new AbortController();
        abortRef.current = controller;

        const result = await analyzeGarment(uri, { signal: controller.signal });
        if (controller.signal.aborted) {
          return;
        }

        setAnalysisResult(result);
        if (result.ok) {
          setPhase('success');
        } else {
          setFailureMessage(result.message);
          setPhase('failed');
        }
      } finally {
        captureLockRef.current = false;
      }
    },
    [phase],
  );

  const retryAnalysis = useCallback(async () => {
    if (!capturedUri || captureLockRef.current) {
      return;
    }
    captureLockRef.current = true;
    setPhase('analyzing');
    setFailureMessage(null);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      const result = await analyzeGarment(capturedUri, { signal: controller.signal });
      if (controller.signal.aborted) {
        return;
      }
      setAnalysisResult(result);
      if (result.ok) {
        setPhase('success');
      } else {
        setFailureMessage(result.message);
        setPhase('failed');
      }
    } finally {
      captureLockRef.current = false;
    }
  }, [capturedUri]);

  const retake = useCallback(() => {
    cancelAsync();
    captureLockRef.current = false;
    setCapturedUri(null);
    setAnalysisResult(null);
    setFailureMessage(null);
    setPhase('preview');
  }, [cancelAsync]);

  const requestPermission = useCallback(() => {
    onRequestPermission();
  }, [onRequestPermission]);

  const showAnalyzingChrome =
    phase === 'analyzing' || phase === 'capturing' || phase === 'success' || phase === 'failed';

  const analyzingLabel =
    phase === 'analyzing' || phase === 'capturing'
      ? 'Analyzing Stains...'
      : phase === 'failed'
        ? 'Analysis unavailable'
        : phase === 'success'
          ? 'Analysis complete'
          : null;

  return {
    phase,
    capturedUri,
    analysisResult,
    failureMessage,
    detectionNotice,
    showAnalyzingChrome,
    analyzingLabel,
    onCameraReady,
    capturePhoto,
    retryAnalysis,
    retake,
    requestPermission,
    cancelAsync,
  };
}
