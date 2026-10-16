import Svg, { Defs, Path, RadialGradient, Stop } from 'react-native-svg';

const FILL_PATH =
  'M0 17.3084C0 12.8902 3.58172 9.30844 8 9.30844H269.945C271.703 9.30844 273.428 8.83331 274.938 7.93329L286.271 1.17871C288.783 -0.318763 291.896 -0.394193 294.478 0.979814L307.981 8.16533C309.391 8.9159 310.965 9.30844 312.562 9.30844H364.311C368.729 9.30844 372.311 12.8902 372.311 17.3084V34.3836C372.311 38.8018 368.729 42.3836 364.311 42.3836H7.99999C3.58171 42.3836 0 38.8018 0 34.3836V17.3084Z';

const STROKE_PATH =
  'M307.981 8.16533L294.478 0.979814C291.896 -0.394193 288.783 -0.318763 286.271 1.17871L274.938 7.93329C273.428 8.8333 271.703 9.30844 269.945 9.30844H8C3.58172 9.30844 0 12.8902 0 17.3084V34.3836C0 38.8018 3.58171 42.3836 7.99999 42.3836H364.311C368.729 42.3836 372.311 38.8018 372.311 34.3836V17.3084C372.311 12.8902 368.729 9.30844 364.311 9.30844H312.562C310.965 9.30844 309.391 8.9159 307.981 8.16533Z';

type SubscribeBannerBackgroundProps = {
  width: number;
  height: number;
};

/** Figma 3346:13492 — speech-bubble banner fill + radial gradient stroke. */
export function SubscribeBannerBackground({ width, height }: SubscribeBannerBackgroundProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 372.311 42.3836"
      preserveAspectRatio="none">
      <Defs>
        <RadialGradient
          id="checkoutSubscribeBannerStroke"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-0.246747 16.0233 -94.3191 -1.10381 263.805 0.758485)">
          <Stop offset="0.197903" stopColor="#5D30F7" />
          <Stop offset="1" stopColor="#E4DDFE" />
        </RadialGradient>
      </Defs>
      <Path d={FILL_PATH} fill="#ECE7FE" />
      <Path
        d={STROKE_PATH}
        fill="none"
        stroke="url(#checkoutSubscribeBannerStroke)"
        strokeWidth={2.7865}
      />
    </Svg>
  );
}
