import { Image, type ImageSourcePropType } from 'react-native';

import { SWASHO_AI_DEMO_SCENARIOS } from '@/constants/swasho-ai-demo-scenarios';

/** Bundled demo asset → URI string for `<Image source={{ uri }}>` on native and web. */
export function resolveDemoGarmentPhotoUri(source: ImageSourcePropType): string {
  const resolved = Image.resolveAssetSource(source);
  if (!resolved?.uri) {
    throw new Error('Unable to resolve demo garment photo asset');
  }
  return resolved.uri;
}

function demoScenarioIndex(garmentServiceId: string, laundryServiceId: string): number {
  const key = `${garmentServiceId}::${laundryServiceId}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i)) % SWASHO_AI_DEMO_SCENARIOS.length;
  }
  return hash;
}

/**
 * Picks a Swasho AI demo analysis image for the contactless upload capture flow.
 * Prefers catalog garment match, then laundry option match, then a stable cycle.
 */
export function demoGarmentPhotoUriForSlot(garmentServiceId: string, laundryServiceId: string): string {
  const byGarment = SWASHO_AI_DEMO_SCENARIOS.find(
    (scenario) => scenario.catalogServiceId === garmentServiceId,
  );
  if (byGarment) {
    return resolveDemoGarmentPhotoUri(byGarment.analysisImage);
  }

  const byOption = SWASHO_AI_DEMO_SCENARIOS.find(
    (scenario) => scenario.catalogOptionId === laundryServiceId,
  );
  if (byOption) {
    return resolveDemoGarmentPhotoUri(byOption.analysisImage);
  }

  const scenario = SWASHO_AI_DEMO_SCENARIOS[demoScenarioIndex(garmentServiceId, laundryServiceId)];
  return resolveDemoGarmentPhotoUri(scenario.analysisImage);
}
