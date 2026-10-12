type ComboLineItem = {
  quantity: number;
};

type SavedCombo = {
  items: ComboLineItem[];
};

/** Garment pieces on single services (one garment line; no double-count across service options). */
export function countSingleGarmentItems(quantities: Record<string, number>): number {
  let maxQty = 0;
  for (const qty of Object.values(quantities)) {
    if (qty > maxQty) {
      maxQty = qty;
    }
  }
  return maxQty;
}

/** Garment pieces assigned to saved multi-service combos (per combo: max line qty). */
export function countMultiGarmentItems(savedCombos: SavedCombo[]): number {
  let total = 0;
  for (const combo of savedCombos) {
    let comboMax = 0;
    for (const item of combo.items) {
      if (item.quantity > comboMax) {
        comboMax = item.quantity;
      }
    }
    if (comboMax > 0) {
      total += comboMax;
    }
  }
  return total;
}

export function formatSingleMultiSummary(singleCount: number, multiCount: number): string | undefined {
  const parts: string[] = [];
  if (singleCount > 0) {
    parts.push(`${singleCount} Single`);
  }
  if (multiCount > 0) {
    parts.push(`${multiCount} Multi`);
  }
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join(' + ');
}
