import { useMemo, useId } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { scopeSvgXmlIds } from '@/lib/scope-svg-xml-ids';

type ScopedSvgXmlProps = {
  xml: string;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export function ScopedSvgXml({ xml, width, height, style }: ScopedSvgXmlProps) {
  const scope = useId().replace(/:/g, '');
  const scopedXml = useMemo(() => scopeSvgXmlIds(xml, scope), [xml, scope]);
  return <SvgXml xml={scopedXml} width={width} height={height} style={style} />;
}
