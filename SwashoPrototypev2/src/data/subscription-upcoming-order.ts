import type { ImageSourcePropType } from 'react-native';

import type { ProviderListService } from '@/data/providers';
import { DEMO_SUBSCRIPTION, type SubscriptionSummary } from '@/data/subscriptions';

export type OrderReviewInstructionId = 'call' | 'guard' | 'doorstep' | 'custom';

export type OrderReviewServiceAssignment = {
  id: string;
  serviceName: string;
  /** Second line under service name, e.g. "+ Iron". */
  serviceNameSuffix?: string;
  itemCount: number;
  photo?: ImageSourcePropType;
  /** Figma gallery placeholder tile (no photo uploaded). */
  useGalleryPlaceholder?: boolean;
};

export type OrderReviewGarmentLine = {
  id: string;
  label: string;
  quantity: number;
  icon: ProviderListService['icon'];
  services: OrderReviewServiceAssignment[];
};

export type SubscriptionUpcomingOrder = {
  subscriptionId: string;
  addressLine: string;
  pickupDateLabel: string;
  pickupTimeLabel: string;
  deliveryDateLabel: string;
  deliveryTimeLabel: string;
  contactlessEnabled: boolean;
  contactlessLocationLabel: string;
  basketItemCount: number;
  garments: OrderReviewGarmentLine[];
  laundryInstructionChips: { id: string; label: string; photo?: ImageSourcePropType }[];
  pickupInstructionIds: OrderReviewInstructionId[];
  deliveryInstructionIds: OrderReviewInstructionId[];
  estimatedBillInr: number;
};

const washFoldThumb = require('@/assets/subscription/order-review/service-wash-fold.png');
const dryCleanThumb = require('@/assets/subscription/order-review/service-dry-cleaning.png');
const dryCleanIronThumb = require('@/assets/subscription/order-review/service-dry-clean-iron.png');
const laundryChipThumb = require('@/assets/checkout/contactless-workflow-upload.png');

/** Figma 3409:16981 — upcoming order for prototype subscription #9632. */
export const DEMO_UPCOMING_ORDER: SubscriptionUpcomingOrder = {
  subscriptionId: DEMO_SUBSCRIPTION.id,
  addressLine: 'A/1201, Lodha Luxuria, Koliwada road, thane',
  pickupDateLabel: 'Thurs, 21 Feb',
  pickupTimeLabel: '4 PM - 6 PM',
  deliveryDateLabel: 'Sat, 23 Feb',
  deliveryTimeLabel: 'By 8 PM',
  contactlessEnabled: true,
  contactlessLocationLabel: 'Collect from Security Guard',
  basketItemCount: 13,
  estimatedBillInr: 227.5,
  pickupInstructionIds: ['call', 'doorstep'],
  deliveryInstructionIds: ['doorstep'],
  laundryInstructionChips: [
    {
      id: 'detergent',
      label: 'Use a small amount of detergent',
      photo: laundryChipThumb,
    },
    {
      id: 'fragrance',
      label: 'Do not use any type of Fragrance',
    },
  ],
  garments: [
    {
      id: 'or-g1',
      label: 'T-Shirt',
      quantity: 5,
      icon: 'tshirt',
      services: [
        {
          id: 'or-g1-s1',
          serviceName: 'Wash & Fold',
          itemCount: 3,
          photo: washFoldThumb,
        },
        {
          id: 'or-g1-s2',
          serviceName: 'Dry Cleaning',
          itemCount: 2,
          photo: dryCleanThumb,
        },
        {
          id: 'or-g1-s3',
          serviceName: 'Dry Cleaning',
          serviceNameSuffix: '+ Iron',
          itemCount: 2,
          photo: dryCleanIronThumb,
        },
      ],
    },
    {
      id: 'or-g2',
      label: 'Trouser/Pant',
      quantity: 2,
      icon: 'trouser',
      services: [
        {
          id: 'or-g2-s1',
          serviceName: 'Wash & Fold',
          itemCount: 2,
          photo: washFoldThumb,
        },
      ],
    },
    {
      id: 'or-g3',
      label: 'Kurti',
      quantity: 3,
      icon: 'shirt',
      services: [
        {
          id: 'or-g3-s1',
          serviceName: 'Wash & Fold',
          itemCount: 2,
          photo: washFoldThumb,
        },
        {
          id: 'or-g3-s2',
          serviceName: 'Dry Cleaning',
          serviceNameSuffix: '+ Iron',
          itemCount: 2,
          photo: dryCleanIronThumb,
        },
      ],
    },
    {
      id: 'or-g4',
      label: 'Saree only',
      quantity: 2,
      icon: 'shirt',
      services: [
        {
          id: 'or-g4-s1',
          serviceName: 'Dry Cleaning',
          itemCount: 2,
          photo: dryCleanThumb,
        },
      ],
    },
  ],
};

const upcomingBySubscriptionId: Record<string, SubscriptionUpcomingOrder> = {
  [DEMO_SUBSCRIPTION.id]: DEMO_UPCOMING_ORDER,
};

export function upcomingOrderForSubscription(
  subscriptionId: string | undefined,
): SubscriptionUpcomingOrder | null {
  if (!subscriptionId) {
    return null;
  }
  return upcomingBySubscriptionId[subscriptionId] ?? null;
}

export function upcomingOrderForSummary(subscription: SubscriptionSummary): SubscriptionUpcomingOrder | null {
  return upcomingOrderForSubscription(subscription.id);
}
