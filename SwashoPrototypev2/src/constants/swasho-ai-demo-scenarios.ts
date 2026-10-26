import type { ImageSourcePropType } from 'react-native';

/** Demo-only scenario IDs for the Swasho AI prototype (simulated analysis, not real AI). */
export type SwashoAiDemoScenarioId =
  | 'white-t-shirt-coffee'
  | 'blue-jeans-mud'
  | 'white-shirt-collar-discoloration';

/** Positioning for the shared flat-lay asset (percent of the thumbnail/card width). */
export type SwashoAiDemoFlatLayCrop = {
  imageWidthPercent: number;
  offsetLeftPercent: number;
};

export type SwashoAiDemoScenario = {
  id: SwashoAiDemoScenarioId;
  title: string;
  thumbnailCrop: SwashoAiDemoFlatLayCrop;
  /** Full-screen analysis uses the same flat-lay with a wider crop. */
  analysisCrop: SwashoAiDemoFlatLayCrop;
  fabricLabel: string;
  stainLabel: string;
  /** Matches labels from HomeScreen service catalogue. */
  recommendedService: string;
  /** Simulated result copy shown after demo stages complete. */
  resultSummary: string;
};

const FLAT_LAY_THUMB = require('@/assets/images/swasho-ai/demo/stained-garments-flatlay.png') as ImageSourcePropType;
const FLAT_LAY_ANALYSIS = require('@/assets/images/swasho-ai/demo/raw_image_3.png') as ImageSourcePropType;

export const SWASHO_AI_DEMO_FLAT_LAY_THUMB = FLAT_LAY_THUMB;
export const SWASHO_AI_DEMO_FLAT_LAY_ANALYSIS = FLAT_LAY_ANALYSIS;

/** Predetermined demo scenarios — simulated outcomes only (not ML / camera analysis). */
export const SWASHO_AI_DEMO_SCENARIOS: SwashoAiDemoScenario[] = [
  {
    id: 'white-t-shirt-coffee',
    title: 'White T-Shirt',
    thumbnailCrop: { imageWidthPercent: 290.65, offsetLeftPercent: 0 },
    analysisCrop: { imageWidthPercent: 300, offsetLeftPercent: 0 },
    fabricLabel: 'Cotton jersey',
    stainLabel: 'Coffee stain',
    recommendedService: ' Stain Removal',
    resultSummary:
      'Demo result: cotton tee with a fresh coffee spot — simulated recommendation is Stain Removal before a standard wash.',
  },
  {
    id: 'blue-jeans-mud',
    title: 'Blue Jeans',
    thumbnailCrop: { imageWidthPercent: 341.8, offsetLeftPercent: -121.38 },
    analysisCrop: { imageWidthPercent: 300, offsetLeftPercent: -100 },
    fabricLabel: 'Denim',
    stainLabel: 'Mud stain',
    recommendedService: 'Wash & Iron',
    resultSummary:
      'Demo result: denim with dried mud — simulated recommendation is Wash & Iron with a pre-treat on the thigh area.',
  },
  {
    id: 'white-shirt-collar-discoloration',
    title: 'White Dress Shirt',
    thumbnailCrop: { imageWidthPercent: 289.41, offsetLeftPercent: -189.55 },
    analysisCrop: { imageWidthPercent: 300, offsetLeftPercent: -200 },
    fabricLabel: 'Cotton poplin',
    stainLabel: 'Collar discoloration',
    recommendedService: 'Dry Cleaning',
    resultSummary:
      'Demo result: dress shirt with collar yellowing — simulated recommendation is Dry Cleaning to restore the collar.',
  },
];

export function getSwashoAiDemoScenario(id: string | undefined): SwashoAiDemoScenario | undefined {
  return SWASHO_AI_DEMO_SCENARIOS.find((scenario) => scenario.id === id);
}

export function isSwashoAiDemoScenarioId(id: string): id is SwashoAiDemoScenarioId {
  return SWASHO_AI_DEMO_SCENARIOS.some((scenario) => scenario.id === id);
}
