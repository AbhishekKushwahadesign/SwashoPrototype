export type GarmentDetectionBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GarmentDetectionReady = {
  ready: true;
  bounds: GarmentDetectionBounds;
  confidence: number;
};

export type GarmentDetectionNotReady = {
  ready: false;
  reason: string;
};

export type GarmentDetectionResult = GarmentDetectionReady | GarmentDetectionNotReady;

export type GarmentDetectionOptions = {
  signal?: AbortSignal;
};

/**
 * On-device garment detection hook point. No ML model ships with this prototype.
 */
export async function detectGarment(
  _imageUri?: string,
  options?: GarmentDetectionOptions,
): Promise<GarmentDetectionResult> {
  if (options?.signal?.aborted) {
    return { ready: false, reason: 'Detection cancelled.' };
  }

  return {
    ready: false,
    reason: 'No on-device garment detection model is configured for this build.',
  };
}
