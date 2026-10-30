import assert from 'node:assert/strict';

import {
  garmentBasketPhotoSatisfied,
  garmentLinkedPhotoTargetCount,
  garmentPhotoProgressFraction,
  garmentPhotoUploadHint,
  garmentPhotoUploadMandatory,
  type ContactlessGarmentPhotoStore,
  type GarmentPhotoServiceSlot,
} from './contactless-garment-photos';

function makeSlots(count: number): GarmentPhotoServiceSlot[] {
  return Array.from({ length: count }, (_, i) => ({
    serviceId: `svc-${i}`,
    title: `Service ${i}`,
    quantity: 1,
    optional: false,
  }));
}

const garmentId = 'garment-a';

// Hint strings
assert.equal(garmentPhotoUploadHint([]), null);
assert.equal(garmentPhotoUploadHint(makeSlots(1)), 'No mandatory uploads required');
assert.equal(garmentPhotoUploadMandatory(makeSlots(1)), false);
assert.equal(garmentPhotoUploadMandatory(makeSlots(3)), true);
assert.equal(
  garmentPhotoUploadHint(makeSlots(2)),
  'Upload photos for any 1 services',
);
assert.equal(
  garmentPhotoUploadHint(makeSlots(3)),
  'Upload photos for any 2 services',
);
assert.equal(
  garmentPhotoUploadHint(makeSlots(4)),
  'Upload photos for any 3 services',
);

assert.equal(garmentLinkedPhotoTargetCount(2), 1);
assert.equal(garmentLinkedPhotoTargetCount(3), 2);
assert.equal(garmentLinkedPhotoTargetCount(4), 3);

const emptyStore: ContactlessGarmentPhotoStore = {};
const threeSlots = makeSlots(3);

assert.equal(garmentBasketPhotoSatisfied(emptyStore, garmentId, threeSlots), false);
assert.equal(garmentPhotoProgressFraction(emptyStore, garmentId, threeSlots), 0);

const onePhotoStore: ContactlessGarmentPhotoStore = {
  [garmentId]: { 'svc-0': ['file://a'] },
};
assert.equal(garmentBasketPhotoSatisfied(onePhotoStore, garmentId, threeSlots), false);
assert.equal(garmentPhotoProgressFraction(onePhotoStore, garmentId, threeSlots), 0.5);

const twoPhotoStore: ContactlessGarmentPhotoStore = {
  [garmentId]: { 'svc-0': ['file://a'], 'svc-1': ['file://b'] },
};
assert.equal(garmentBasketPhotoSatisfied(twoPhotoStore, garmentId, threeSlots), true);
assert.equal(garmentPhotoProgressFraction(twoPhotoStore, garmentId, threeSlots), 1);

const optionalSingle: GarmentPhotoServiceSlot[] = [
  { serviceId: 'only', title: 'Only', quantity: 1, optional: true },
];
assert.equal(garmentBasketPhotoSatisfied(emptyStore, garmentId, optionalSingle), true);
assert.equal(garmentPhotoProgressFraction(emptyStore, garmentId, optionalSingle), 1);

console.log('contactless-garment-photos: ok');
