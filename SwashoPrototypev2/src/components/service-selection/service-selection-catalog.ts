export type ServiceCatalogOption = {
  id: string;
  title: string;
  amount: number;
  titleStyle?: 'semibold' | 'medium';
  titleFontSize?: 14 | 15 | 16;
  addMode?: 'add' | 'select';
};

export type ServiceCatalogSection = {
  id: string;
  title: string;
  options: ServiceCatalogOption[];
};

export const SERVICE_SELECTION_CATALOG: {
  sections: ServiceCatalogSection[];
} = {
  sections: [
    {
      id: 'basic-care',
      title: 'Basic Care',
      options: [
        { id: 'ironing', title: 'Ironing', amount: 15, titleStyle: 'semibold' },
        { id: 'wash-iron', title: 'Wash & Iron', amount: 49, titleStyle: 'semibold' },
        { id: 'wash-fold', title: 'Wash & fold', amount: 49, titleStyle: 'semibold' },
      ],
    },
    {
      id: 'special-care',
      title: 'Special Care',
      options: [
        { id: 'dry-cleaning', title: 'Dry Cleaning', amount: 49, titleStyle: 'semibold', addMode: 'select' },
        { id: 'stain-removal', title: 'Stain removal', amount: 49, titleStyle: 'semibold', addMode: 'select' },
      ],
    },
    {
      id: 'pressing',
      title: 'Pressing',
      options: [
        { id: 'pressing-ironing', title: 'Ironing', amount: 49, titleStyle: 'semibold', addMode: 'select' },
      ],
    },
  ],
};

export const DEFAULT_COMBOS = [
  {
    id: 'combo-1',
    title: 'Combo 1',
    label: 'Dry Cleaning + Iron',
    amount: 86,
  },
] as const;

export function getCatalogOptionById(optionId: string): ServiceCatalogOption | undefined {
  for (const section of SERVICE_SELECTION_CATALOG.sections) {
    const match = section.options.find((option) => option.id === optionId);
    if (match) {
      return match;
    }
  }
  return undefined;
}
