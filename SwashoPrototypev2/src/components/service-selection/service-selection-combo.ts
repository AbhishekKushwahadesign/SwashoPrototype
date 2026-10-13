export function formatComboLabel(titles: string[]): string {
  return titles.join(' + ');
}

export function sumComboUnitAmount(items: { amount: number }[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function getComboGarmentQuantity(items: { quantity: number }[]): number {
  return items.reduce((max, item) => (item.quantity > max ? item.quantity : max), 0);
}
