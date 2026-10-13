type ComboLineItem = {
  quantity: number;
};

type SavedCombo = {
  items: ComboLineItem[];
};

/** Sum of single-service line quantities (each service × qty counts toward Single). */
export function countSingleGarmentItems(quantities: Record<string, number>): number {
  let total = 0;
  for (const qty of Object.values(quantities)) {
    if (qty > 0) {
      total += qty;
    }
  }
  return total;
}

/** Sum of garment quantities per saved combo (one combo row = max line qty, not # of services in combo). */
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
