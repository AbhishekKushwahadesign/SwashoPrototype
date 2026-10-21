import { CheckoutGradientDualSegment } from './CheckoutGradientDualSegment';

type CheckoutServiceHandoverSegmentProps = {
  contactless: boolean;
  onContactlessChange: (contactless: boolean) => void;
  scale: number;
};

/** Figma 59077:3248 — Standard vs Contactless handover toggle on checkout review. */
export function CheckoutServiceHandoverSegment({
  contactless,
  onContactlessChange,
  scale,
}: CheckoutServiceHandoverSegmentProps) {
  return (
    <CheckoutGradientDualSegment
      typography="service-handover"
      scale={scale}
      left={{ title: 'Standard Service', subtitle: 'Handover in person' }}
      right={{ title: 'Contactless Service', subtitle: 'No handover needed!' }}
      activeSide={contactless ? 'right' : 'left'}
      onSelect={(side) => onContactlessChange(side === 'right')}
    />
  );
}
