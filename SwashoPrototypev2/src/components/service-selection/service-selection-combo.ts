export function formatComboLabel(titles: string[]): string {
  return titles.join(' + ');
}

export function sumComboUnitAmount(items: { amount: number }[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0);
}
