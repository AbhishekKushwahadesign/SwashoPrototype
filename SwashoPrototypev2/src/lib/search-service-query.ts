import type { GarmentServiceColumn } from '@/data/garment-pricing';

/** Allowed provider search services (display labels). */
export const ALLOWED_SEARCH_SERVICES = [
  'Ironing',
  'Dry Cleaning',
  'Wash and Fold',
  'Wash and Iron',
] as const;

export type AllowedSearchService = (typeof ALLOWED_SEARCH_SERVICES)[number];

const SERVICE_META: readonly {
  label: AllowedSearchService;
  column: GarmentServiceColumn;
  aliases: readonly string[];
}[] = [
  {
    label: 'Ironing',
    column: 'onlyIron',
    aliases: ['iron', 'ironing', 'iro', 'press', 'pressing'],
  },
  {
    label: 'Dry Cleaning',
    column: 'dryClean',
    aliases: ['dry', 'dryclean', 'dry clean', 'cleaning'],
  },
  {
    label: 'Wash and Fold',
    column: 'washFold',
    aliases: ['wash fold', 'wash & fold', 'washfold', 'fold', 'laundry fold'],
  },
  {
    label: 'Wash and Iron',
    column: 'washIron',
    aliases: ['wash iron', 'wash & iron', 'washiron', 'wash and iron', 'laundry iron'],
  },
];

function compact(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[] = new Array(rows * cols);
  for (let i = 0; i < rows; i++) {
    matrix[i * cols] = i;
  }
  for (let j = 0; j < cols; j++) {
    matrix[j] = j;
  }
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const idx = i * cols + j;
      matrix[idx] = Math.min(
        matrix[(i - 1) * cols + j] + 1,
        matrix[i * cols + (j - 1)] + 1,
        matrix[(i - 1) * cols + (j - 1)] + cost,
      );
    }
  }
  return matrix[(rows - 1) * cols + (cols - 1)];
}

function matchByKeywords(normalized: string): AllowedSearchService | null {
  const hasWash = normalized.includes('wash');
  const hasIron = normalized.includes('iron');
  const hasFold = normalized.includes('fold');
  const hasDry = normalized.includes('dry') || normalized.includes('clean');

  if (hasWash && hasIron) {
    return 'Wash and Iron';
  }
  if (hasFold || (hasWash && hasFold)) {
    return 'Wash and Fold';
  }
  if (hasDry) {
    return 'Dry Cleaning';
  }
  if (hasIron) {
    return 'Ironing';
  }
  return null;
}

function fuzzyMatch(compactInput: string): AllowedSearchService {
  let bestLabel: AllowedSearchService = 'Dry Cleaning';
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const service of SERVICE_META) {
    const candidates = [service.label, ...service.aliases];
    for (const candidate of candidates) {
      const distance = levenshtein(compactInput, compact(candidate));
      if (distance < bestDistance) {
        bestDistance = distance;
        bestLabel = service.label;
      }
    }
  }

  const maxAllowed = Math.max(2, Math.floor(compactInput.length / 2) + 1);
  if (bestDistance <= maxAllowed) {
    return bestLabel;
  }
  return 'Dry Cleaning';
}

/** Map free-text (with typos) to one of the four allowed search services. */
export function resolveSearchServiceQuery(input: string): AllowedSearchService {
  const trimmed = input.trim();
  if (!trimmed) {
    return 'Dry Cleaning';
  }

  const normalized = trimmed.toLowerCase().replace(/\s+/g, ' ');
  const compactInput = compact(trimmed);

  for (const service of SERVICE_META) {
    if (compact(service.label) === compactInput) {
      return service.label;
    }
    for (const alias of service.aliases) {
      if (compact(alias) === compactInput) {
        return service.label;
      }
    }
  }

  const keywordMatch = matchByKeywords(normalized);
  if (keywordMatch) {
    return keywordMatch;
  }

  return fuzzyMatch(compactInput);
}

export function searchServiceColumnFromLabel(label: AllowedSearchService): GarmentServiceColumn {
  const match = SERVICE_META.find((service) => service.label === label);
  return match?.column ?? 'dryClean';
}
