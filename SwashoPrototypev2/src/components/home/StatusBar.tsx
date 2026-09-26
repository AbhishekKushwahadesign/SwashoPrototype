import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';

type StatusBarProps = {
  scale: number;
};

const ICON_COLOR = '#E6E6E6';

function WifiIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 13.3333L0 5.33333C1.05556 4.25556 2.275 3.43056 3.65833 2.85833C5.04167 2.28611 6.48889 2 8 2C9.51111 2 10.9583 2.28611 12.3417 2.85833C13.725 3.43056 14.9444 4.25556 16 5.33333L8 13.3333Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}

function ReceptionIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M1 14.3333L14.3333 1V14.3333H1ZM9.66667 13H13V4.23333L9.66667 7.56667V13Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}

function BatteryIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M5.66667 14.3333C5.47778 14.3333 5.31944 14.2694 5.19167 14.1417C5.06389 14.0139 5 13.8556 5 13.6667V3C5 2.81111 5.06389 2.65278 5.19167 2.525C5.31944 2.39722 5.47778 2.33333 5.66667 2.33333H7V1H9.66667V2.33333H11C11.1889 2.33333 11.3472 2.39722 11.475 2.525C11.6028 2.65278 11.6667 2.81111 11.6667 3V13.6667C11.6667 13.8556 11.6028 14.0139 11.475 14.1417C11.3472 14.2694 11.1889 14.3333 11 14.3333H5.66667ZM6.33333 5H10.3333V3.66667H6.33333V5Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}

export function StatusBar({ scale }: StatusBarProps) {
  const iconSize = 16 * scale;

  return (
    <View style={[styles.container, { height: 32 * scale, paddingHorizontal: 8 * scale, paddingVertical: 4 * scale }]}>
      <Text style={[styles.time, { fontSize: 12 * scale }]}>11:07</Text>
      <View style={[styles.icons, { gap: 4 * scale }]}>
        <WifiIcon size={iconSize} />
        <ReceptionIcon size={iconSize} />
        <BatteryIcon size={iconSize} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  time: {
    fontFamily: SwashoFonts.robotoMedium,
    letterSpacing: 0,
    color: SwashoColors.statusTime,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
