import assert from 'node:assert/strict';

import {
  countMultiGarmentItems,
  countSingleGarmentItems,
  formatSingleMultiSummary,
} from './service-selection-assignment-counts';

// Example A — Single
assert.equal(countSingleGarmentItems({ ironing: 1 }), 1);
assert.equal(countSingleGarmentItems({ ironing: 1, 'wash-iron': 1 }), 2);
assert.equal(countSingleGarmentItems({ ironing: 1, 'wash-iron': 1, 'wash-fold': 1 }), 3);
assert.equal(countSingleGarmentItems({ ironing: 2, 'wash-iron': 1, 'wash-fold': 1 }), 4);

// Example B — Multi
const combosB = [
  { items: [{ quantity: 1 }] },
  { items: [{ quantity: 1 }] },
  { items: [{ quantity: 2 }] },
];
assert.equal(countMultiGarmentItems(combosB), 4);

// Example C — Mixed
assert.equal(countSingleGarmentItems({ ironing: 1, 'wash-fold': 1 }), 2);
assert.equal(
  countMultiGarmentItems([{ items: [{ quantity: 1 }] }, { items: [{ quantity: 1 }] }]),
  2,
);
assert.equal(formatSingleMultiSummary(2, 2), '2 Single + 2 Multi');

console.log('service-selection-assignment-counts: ok');
