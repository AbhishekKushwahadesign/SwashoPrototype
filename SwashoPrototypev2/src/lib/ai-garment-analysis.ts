export type GarmentAnalysisRecommendation = {
  serviceId: string;
  label: string;
  rationale: string;
};

export type GarmentAnalysisSuccess = {
  ok: true;
  recommendations: GarmentAnalysisRecommendation[];
  stainSummary?: string;
};

export type GarmentAnalysisFailure = {
  ok: false;
  reason: 'not_connected' | 'cancelled' | 'network' | 'unknown';
  message: string;
};

export type GarmentAnalysisResult = GarmentAnalysisSuccess | GarmentAnalysisFailure;

export type GarmentAnalysisOptions = {
  signal?: AbortSignal;
};

const ANALYSIS_API_URL = process.env.EXPO_PUBLIC_GARMENT_ANALYSIS_URL;

/**
 * Backend garment / stain analysis hook point. Requires EXPO_PUBLIC_GARMENT_ANALYSIS_URL when wired.
 */
export async function analyzeGarment(
  _imageUri: string,
  options?: GarmentAnalysisOptions,
): Promise<GarmentAnalysisResult> {
  if (options?.signal?.aborted) {
    return {
      ok: false,
      reason: 'cancelled',
      message: 'Analysis was cancelled.',
    };
  }

  if (!ANALYSIS_API_URL) {
    return {
      ok: false,
      reason: 'not_connected',
      message: 'Garment analysis is not connected yet. Connect an API to enable recommendations.',
    };
  }

  try {
    const response = await fetch(ANALYSIS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUri: _imageUri }),
      signal: options?.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: 'network',
        message: `Analysis request failed (${response.status}).`,
      };
    }

    const payload = (await response.json()) as Partial<GarmentAnalysisSuccess>;
    if (!payload.recommendations?.length) {
      return {
        ok: false,
        reason: 'unknown',
        message: 'Analysis returned no recommendations.',
      };
    }

    return {
      ok: true,
      recommendations: payload.recommendations,
      stainSummary: payload.stainSummary,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        ok: false,
        reason: 'cancelled',
        message: 'Analysis was cancelled.',
      };
    }
    return {
      ok: false,
      reason: 'network',
      message: 'Could not reach the garment analysis service.',
    };
  }
}
