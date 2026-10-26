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

/** Simulated AI recommendation modal copy — not live detection. */
export type SwashoAiDemoRecommendation = {
  detectedStainLabel: string;
  detectedGarmentLabel: string;
  modalServiceTitle: string;
  providerName: string;
  providerPriceInr: number;
  providerRating: number;
  deliveryDays: number;
  expertBadgeLabel: string;
  /** Optional service-selection route id for primary CTA. */
  serviceSelectionId: string;
};

export type SwashoAiDemoScenario = {
  id: SwashoAiDemoScenarioId;
  title: string;
  cardImage: ImageSourcePropType;
  analysisImage: ImageSourcePropType;
  analysisContentFit?: 'cover' | 'contain';
  thumbnailCrop: SwashoAiDemoFlatLayCrop;
  analysisCrop: SwashoAiDemoFlatLayCrop;
  fabricLabel: string;
  stainLabel: string;
  recommendedService: string;
  resultSummary: string;
  recommendation: SwashoAiDemoRecommendation;
};

const FLAT_LAY_THUMB = require('@/assets/images/swasho-ai/demo/stained-garments-flatlay.png') as ImageSourcePropType;
const FLAT_LAY_ANALYSIS = require('@/assets/images/swasho-ai/demo/raw_image_3.png') as ImageSourcePropType;

const CARD_WHITE_TSHIRT = require('@/assets/images/swasho-ai/demo/white-t-shirt-coffee-thumb.png') as ImageSourcePropType;
const CARD_BLUE_JEANS = require('@/assets/images/swasho-ai/demo/blue-jeans-mud-thumb.png') as ImageSourcePropType;
const CARD_WHITE_SHIRT = require('@/assets/images/swasho-ai/demo/white-shirt-collar-thumb.png') as ImageSourcePropType;

const ANALYSIS_WHITE_TSHIRT = require('@/assets/images/swasho-ai/demo/demo-analysis-white-tshirt-coffee.png') as ImageSourcePropType;
const ANALYSIS_BLUE_JEANS = require('@/assets/images/swasho-ai/demo/demo-analysis-blue-jeans-mud.png') as ImageSourcePropType;
const ANALYSIS_WHITE_SHIRT = require('@/assets/images/swasho-ai/demo/demo-analysis-white-shirt-collar.png') as ImageSourcePropType;

export const SWASHO_AI_DEMO_FLAT_LAY_THUMB = FLAT_LAY_THUMB;
export const SWASHO_AI_DEMO_FLAT_LAY_ANALYSIS = FLAT_LAY_ANALYSIS;

export const SWASHO_AI_DEMO_PROVIDER_IMAGE = require('@/assets/images/swasho-ai/recommendation/provider-laundry-pro.png') as ImageSourcePropType;

/** Predetermined demo scenarios — simulated outcomes only (not ML / camera analysis). */
export const SWASHO_AI_DEMO_SCENARIOS: SwashoAiDemoScenario[] = [
  {
    id: 'white-t-shirt-coffee',
    title: 'White T-Shirt',
    cardImage: CARD_WHITE_TSHIRT,
    analysisImage: ANALYSIS_WHITE_TSHIRT,
    analysisContentFit: 'cover',
    thumbnailCrop: { imageWidthPercent: 290.65, offsetLeftPercent: 0 },
    analysisCrop: { imageWidthPercent: 300, offsetLeftPercent: 0 },
    fabricLabel: 'Cotton jersey',
    stainLabel: 'Coffee stain',
    recommendedService: 'Stain Removal',
    resultSummary:
      'Demo result: cotton tee with a fresh coffee spot — simulated recommendation is Stain Removal before a standard wash.',
    recommendation: {
      detectedStainLabel: 'Coffee stain',
      detectedGarmentLabel: 'White cotton t-shirt',
      modalServiceTitle: 'Stain Removal',
      providerName: 'Laundry Pro',
      providerPriceInr: 50,
      providerRating: 4.5,
      deliveryDays: 2,
      expertBadgeLabel: 'Stain Removal Expert',
      serviceSelectionId: 'wash-iron',
    },
  },
  {
    id: 'blue-jeans-mud',
    title: 'Blue Jeans',
    cardImage: CARD_BLUE_JEANS,
    analysisImage: ANALYSIS_BLUE_JEANS,
    analysisContentFit: 'cover',
    thumbnailCrop: { imageWidthPercent: 341.8, offsetLeftPercent: -121.38 },
    analysisCrop: { imageWidthPercent: 300, offsetLeftPercent: -100 },
    fabricLabel: 'Denim',
    stainLabel: 'Mud stain',
    recommendedService: 'Wash & Iron',
    resultSummary:
      'Demo result: denim with dried mud — simulated recommendation is Wash & Iron with a pre-treat on the thigh area.',
    recommendation: {
      detectedStainLabel: 'Mud stain',
      detectedGarmentLabel: 'Blue denim jeans',
      modalServiceTitle: 'Wash & Iron',
      providerName: 'Laundry Pro',
      providerPriceInr: 40,
      providerRating: 4.5,
      deliveryDays: 2,
      expertBadgeLabel: 'Heavy soil specialist',
      serviceSelectionId: 'wash-iron',
    },
  },
  {
    id: 'white-shirt-collar-discoloration',
    title: 'White Dress Shirt',
    cardImage: CARD_WHITE_SHIRT,
    analysisImage: ANALYSIS_WHITE_SHIRT,
    analysisContentFit: 'cover',
    thumbnailCrop: { imageWidthPercent: 289.41, offsetLeftPercent: -189.55 },
    analysisCrop: { imageWidthPercent: 300, offsetLeftPercent: -200 },
    fabricLabel: 'Cotton poplin',
    stainLabel: 'Collar discoloration',
    recommendedService: 'Dry Cleaning',
    resultSummary:
      'Demo result: dress shirt with collar yellowing — simulated recommendation is Dry Cleaning to restore the collar.',
    recommendation: {
      detectedStainLabel: 'Collar discoloration',
      detectedGarmentLabel: 'White cotton shirt',
      modalServiceTitle: 'Dry Cleaning + Whitening',
      providerName: 'Laundry Pro',
      providerPriceInr: 158,
      providerRating: 4.5,
      deliveryDays: 2,
      expertBadgeLabel: 'Stain Removal Expert',
      serviceSelectionId: 'dry-cleaning',
    },
  },
];

export function getSwashoAiDemoScenario(id: string | undefined): SwashoAiDemoScenario | undefined {
  return SWASHO_AI_DEMO_SCENARIOS.find((scenario) => scenario.id === id);
}

export function isSwashoAiDemoScenarioId(id: string): id is SwashoAiDemoScenarioId {
  return SWASHO_AI_DEMO_SCENARIOS.some((scenario) => scenario.id === id);
}
