import { CheckoutGradientDualSegment } from './CheckoutGradientDualSegment';
import type { ProviderOrderFulfillmentMode } from '@/lib/checkout-flow';

type CheckoutOrderTypeSegmentProps = {
  activeMode: ProviderOrderFulfillmentMode;
  onSelectMode: (mode: ProviderOrderFulfillmentMode) => void;
  scale: number;
};

export function CheckoutOrderTypeSegment({
  activeMode,
  onSelectMode,
  scale,
}: CheckoutOrderTypeSegmentProps) {
  return (
    <CheckoutGradientDualSegment
      typography="order-type"
      scale={scale}
      left={{ title: 'One-Time', subtitle: 'Pay Standard Pricing' }}
      right={{ title: 'Subscribe', subtitle: 'Unlock Exclusive Pricing' }}
      activeSide={activeMode === 'one-time' ? 'left' : 'right'}
      onSelect={(side) => onSelectMode(side === 'left' ? 'one-time' : 'subscribe')}
    />
  );
}
