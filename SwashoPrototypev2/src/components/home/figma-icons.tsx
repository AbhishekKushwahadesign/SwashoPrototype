import type { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

const AiAIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="14.4557" height="14.7215" viewBox="0 0 14.4557 14.7215" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="A" d="M7.56225 2.17232L4.23045 12.5809C3.82222 13.8562 2.63665 14.7215 1.29759 14.7215H0.207307C0.0630638 14.7215 -0.03701 14.5778 0.0130665 14.4425L4.76571 1.6042C5.23829 0.327608 6.65895 -0.321181 7.93321 0.15766L7.56225 2.17232ZM13.1528 14.7215C11.811 14.7215 10.6228 13.855 10.2128 12.5774L6.87331 2.17232L6.47055 0.15766C7.75832 -0.321858 9.19098 0.333438 9.67037 1.62125L14.4424 14.4406C14.4931 14.5767 14.3925 14.7215 14.2473 14.7215H13.1528ZM10.7313 8.97687V11.616H2.67611V8.97687H10.7313Z" fill="#7C7C7C"/>
</svg>`;

export function AiAIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={AiAIconXml} width={width} height={height} style={style} />;
}

const AltArrowDownIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Arrows / Alt Arrow Down">
<path id="Vector" d="M15.8333 7.5L10 12.5L4.16667 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</svg>`;

export function AltArrowDownIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={AltArrowDownIconXml} width={width} height={height} style={style} />;
}

const AltArrowRightIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Arrows / Alt Arrow Right">
<path id="Vector" d="M7.5 4.16667L12.5 10L7.5 15.8333" stroke="#1A1A1A" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</svg>`;

export function AltArrowRightIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={AltArrowRightIconXml} width={width} height={height} style={style} />;
}

const ArrowRightIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Arrows / Arrow Right">
<path id="Vector" d="M3.33333 10H16.6667M11.6667 15L16.6667 10L11.6667 5" stroke="#5D30F7" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
</g>
</svg>`;

export function ArrowRightIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={ArrowRightIconXml} width={width} height={height} style={style} />;
}

const BatteryIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Battery">
<path id="Vector" d="M5.66667 14.3333C5.47778 14.3333 5.31944 14.2694 5.19167 14.1417C5.06389 14.0139 5 13.8556 5 13.6667V3C5 2.81111 5.06389 2.65278 5.19167 2.525C5.31944 2.39722 5.47778 2.33333 5.66667 2.33333H7V1H9.66667V2.33333H11C11.1889 2.33333 11.3472 2.39722 11.475 2.525C11.6028 2.65278 11.6667 2.81111 11.6667 3V13.6667C11.6667 13.8556 11.6028 14.0139 11.475 14.1417C11.3472 14.2694 11.1889 14.3333 11 14.3333H5.66667ZM6.33333 5H10.3333V3.66667H6.33333V5Z" fill="#E6E6E6"/>
</g>
</svg>`;

export function BatteryIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={BatteryIconXml} width={width} height={height} style={style} />;
}

const CalendarBoldIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="37.5957" height="37.5957" viewBox="0 0 37.5957 37.5957" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Time / Calendar Add" opacity="0.7">
</g>
</svg>`;

export function CalendarBoldIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={CalendarBoldIconXml} width={width} height={height} style={style} />;
}

const CalendarLinearIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20.8844" height="20.8844" viewBox="0 0 20.8844 20.8844" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Time / Calendar Add">
<path id="Vector" d="M1.74037 10.4422C1.74037 7.16054 1.74037 5.5197 2.75985 4.50022C3.77934 3.48074 5.42017 3.48074 8.70184 3.48074H12.1826C15.4642 3.48074 17.1051 3.48074 18.1246 4.50022C19.144 5.5197 19.144 7.16054 19.144 10.4422V12.1826C19.144 15.4642 19.144 17.1051 18.1246 18.1246C17.1051 19.144 15.4642 19.144 12.1826 19.144H8.70184C5.42017 19.144 3.77934 19.144 2.75985 18.1246C1.74037 17.1051 1.74037 15.4642 1.74037 12.1826V10.4422Z" stroke="#7C7C7C" strokeWidth="1.30528"/>
<path id="Vector_2" d="M15.6633 13.923L13.9229 13.923M13.9229 13.923L12.1826 13.923M13.9229 13.923L13.9229 12.1826M13.9229 13.923L13.9229 15.6633" stroke="#7C7C7C" strokeWidth="1.30528" strokeLinecap="round"/>
<path id="Vector_3" d="M6.09129 3.48074V2.17546" stroke="#7C7C7C" strokeWidth="1.30528" strokeLinecap="round"/>
<path id="Vector_4" d="M14.7931 3.48074V2.17546" stroke="#7C7C7C" strokeWidth="1.30528" strokeLinecap="round"/>
<path id="Vector_5" d="M2.17546 7.83165H18.709" stroke="#7C7C7C" strokeWidth="1.30528" strokeLinecap="round"/>
</g>
</svg>`;

export function CalendarLinearIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={CalendarLinearIconXml} width={width} height={height} style={style} />;
}

const CheckSquareIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="43.2" height="43.2" viewBox="0 0 43.2 43.2" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Essentional, UI / Check Square">
<path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M21.6 39.6C13.1147 39.6 8.87208 39.6 6.23604 36.964C3.6 34.3279 3.6 30.0853 3.6 21.6C3.6 13.1147 3.6 8.87208 6.23604 6.23604C8.87208 3.6 13.1147 3.6 21.6 3.6C30.0853 3.6 34.3279 3.6 36.964 6.23604C39.6 8.87208 39.6 13.1147 39.6 21.6C39.6 30.0853 39.6 34.3279 36.964 36.964C34.3279 39.6 30.0853 39.6 21.6 39.6ZM28.8546 16.1454C29.3818 16.6726 29.3818 17.5274 28.8546 18.0546L19.8546 27.0546C19.3274 27.5818 18.4726 27.5818 17.9454 27.0546L14.3454 23.4546C13.8182 22.9274 13.8182 22.0726 14.3454 21.5454C14.8726 21.0182 15.7274 21.0182 16.2546 21.5454L18.9 24.1908L26.9454 16.1454C27.4726 15.6182 28.3274 15.6182 28.8546 16.1454Z" fill="white"/>
</g>
</svg>`;

export function CheckSquareIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={CheckSquareIconXml} width={width} height={height} style={style} />;
}

const CheckSquare2IconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="45.6" height="45.6" viewBox="0 0 45.6 45.6" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Essentional, UI / Check Square">
<path id="Vector" fillRule="evenodd" clipRule="evenodd" d="M22.8 41.8C13.8433 41.8 9.36497 41.8 6.58249 39.0175C3.8 36.235 3.8 31.7567 3.8 22.8C3.8 13.8433 3.8 9.36497 6.58249 6.58249C9.36497 3.8 13.8433 3.8 22.8 3.8C31.7567 3.8 36.235 3.8 39.0175 6.58249C41.8 9.36497 41.8 13.8433 41.8 22.8C41.8 31.7567 41.8 36.235 39.0175 39.0175C36.235 41.8 31.7567 41.8 22.8 41.8ZM30.4576 17.0424C31.0141 17.5989 31.0141 18.5011 30.4576 19.0576L20.9576 28.5576C20.4011 29.1141 19.4989 29.1141 18.9424 28.5576L15.1424 24.7576C14.5859 24.2011 14.5859 23.2989 15.1424 22.7424C15.6989 22.1859 16.6011 22.1859 17.1576 22.7424L19.95 25.5347L28.4424 17.0424C28.9989 16.4859 29.9011 16.4859 30.4576 17.0424Z" fill="white"/>
</g>
</svg>`;

export function CheckSquare2Icon({ width, height, style }: IconProps) {
  return <SvgXml xml={CheckSquare2IconXml} width={width} height={height} style={style} />;
}

const HomeSmileIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20.8844" height="20.8844" viewBox="0 0 20.8844 20.8844" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Essentional, UI / Home Smile" clipPath="url(#clip0_0_391)">
<g id="Vector" filter="url(#filter0_d_0_391)">
<path fillRule="evenodd" clipRule="evenodd" d="M2.19217 6.80722C1.74037 7.63262 1.74037 8.6283 1.74037 10.6197V11.9432C1.74037 15.3377 1.74037 17.035 2.75985 18.0895C3.77934 19.144 5.42017 19.144 8.70184 19.144H12.1826C15.4642 19.144 17.1051 19.144 18.1246 18.0895C19.144 17.035 19.144 15.3377 19.144 11.9432V10.6197C19.144 8.6283 19.144 7.63262 18.6922 6.80722C18.2404 5.98182 17.415 5.46955 15.7642 4.44501L14.0239 3.36489C12.2788 2.28187 11.4063 1.74037 10.4422 1.74037C9.4781 1.74037 8.60558 2.28187 6.86056 3.36489L5.12019 4.44501C3.46937 5.46955 2.64397 5.98182 2.19217 6.80722ZM8.22029 13.3986C7.93072 13.184 7.52198 13.2447 7.30735 13.5343C7.09271 13.8239 7.15345 14.2326 7.44302 14.4472C8.2892 15.0745 9.32404 15.4458 10.4422 15.4458C11.5604 15.4458 12.5952 15.0745 13.4414 14.4472C13.731 14.2326 13.7917 13.8239 13.5771 13.5343C13.3624 13.2447 12.9537 13.184 12.6641 13.3986C12.0303 13.8684 11.2653 14.1405 10.4422 14.1405C9.6191 14.1405 8.85408 13.8684 8.22029 13.3986Z" fill="white"/>
</g>
</g>
<defs>
<filter id="filter0_d_0_391" x="-0.459632" y="1.74037" width="19.6037" height="19.6037" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-2" dy="2"/>
<feGaussianBlur stdDeviation="0.1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_391"/>`;

export function HomeSmileIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={HomeSmileIconXml} width={width} height={height} style={style} />;
}

const Line13IconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="229" height="2" viewBox="0 0 229 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Line 13" d="M1 1H228" stroke="url(#paint0_linear_0_302)" strokeWidth="2" strokeLinecap="round" stroke-dasharray="6 6"/>
<defs>
<linearGradient id="paint0_linear_0_302" x1="1" y1="1.5" x2="228" y2="0.99998" gradientUnits="userSpaceOnUse">
<stop offset="0.445751" stop-color="#0D0D0D"/>
<stop offset="0.453868" stop-color="#BDBDBD"/>
</linearGradient>
</defs>
</svg>`;

export function Line13Icon({ width, height, style }: IconProps) {
  return <SvgXml xml={Line13IconXml} width={width} height={height} style={style} />;
}

const Line35IconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="124.558" height="14.8065" viewBox="0 0 124.558 14.8065" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Line 35" d="M0.798519 0.375511C0.532346 0.391729 0.266173 0.407947 0 0.424165C0.163829 2.76096 0.604202 4.91073 1.64581 6.99914C7.2207 16.7623 19.8234 14.8955 29.2 14.179C39.1273 13.0505 48.923 11.0465 58.7152 9.17945C78.3004 5.36999 97.9577 1.80156 117.902 0.6837C120.054 0.562005 122.201 0.468491 124.362 0.405153C124.424 0.403357 124.489 0.534859 124.558 0.799676C124.55 0.533117 124.542 0.266559 124.535 0C124.481 0.268313 124.424 0.403357 124.362 0.405153C122.201 0.468491 120.054 0.561373 117.902 0.681807C97.9581 1.78779 78.2875 5.29154 58.678 8.9835C48.8761 10.7915 39.063 12.7229 29.156 13.7613C19.7886 14.4532 7.29794 15.9095 2.29207 6.67745C1.33127 4.69642 0.930467 2.63794 0.798519 0.375511Z" fill="#989898"/>
</svg>`;

export function Line35Icon({ width, height, style }: IconProps) {
  return <SvgXml xml={Line35IconXml} width={width} height={height} style={style} />;
}

const Line36IconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="170.132" height="31.8198" viewBox="0 0 170.132 31.8198" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Line 36" filter="url(#filter0_f_0_394)">
<path d="M1.6 3.89379C1.60313 4.16044 1.60627 4.42709 1.6094 4.69374C4.3994 4.64738 7.41139 4.51574 10.2214 4.37165C61.0716 1.83968 117.103 -4.77143 161.601 24.432C163.86 26.0818 166.034 27.8618 168.084 29.7651C168.143 29.8191 168.11 29.971 167.986 30.2198C168.168 30.025 168.35 29.8301 168.532 29.6353C168.291 29.7756 168.143 29.8191 168.084 29.7651C166.034 27.8618 163.861 26.0813 161.602 24.4304C117.142 -4.79179 61.0633 1.57235 10.1876 3.65054C7.38069 3.76912 4.37437 3.87435 1.6 3.89379Z" fill="#989898"/>
</g>
<defs>
<filter id="filter0_f_0_394" x="2.04891e-08" y="0" width="170.132" height="31.8198" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.8" result="effect1_foregroundBlur_0_394"/>
</filter>
</defs>
</svg>`;

export function Line36Icon({ width, height, style }: IconProps) {
  return <SvgXml xml={Line36IconXml} width={width} height={height} style={style} />;
}

const Line37IconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="113.63" height="119.61" viewBox="0 0 113.63 119.61" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Line 37" filter="url(#filter0_f_0_383)">
<path d="M1.64468 1.8358C65.2359 13.8853 111.623 108.134 111.79 118.006" stroke="#989898" strokeWidth="0.48"/>
</g>
<defs>
<filter id="filter0_f_0_383" x="3.72529e-09" y="1.49012e-08" width="113.63" height="119.61" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.8" result="effect1_foregroundBlur_0_383"/>
</filter>
</defs>
</svg>`;

export function Line37Icon({ width, height, style }: IconProps) {
  return <SvgXml xml={Line37IconXml} width={width} height={height} style={style} />;
}

const LineDividerIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="29" height="1" viewBox="0 0 29 1" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Line 11" d="M0.5 0.5H28.5" stroke="#DCDCDC" strokeLinecap="round"/>
</svg>`;

export function LineDividerIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={LineDividerIconXml} width={width} height={height} style={style} />;
}

const MagnifierIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Video, Audio, Sound / Microphone 4" clipPath="url(#clip0_0_506)">
<circle id="Vector" cx="9.58333" cy="9.58333" r="7.91667" stroke="#656565" strokeWidth="1.5"/>
<path id="Vector_2" d="M15.4167 15.4167L18.3333 18.3333" stroke="#656565" strokeWidth="1.5" strokeLinecap="round"/>
</g>
<defs>
<clipPath id="clip0_0_506">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>`;

export function MagnifierIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={MagnifierIconXml} width={width} height={height} style={style} />;
}

const MicrophoneIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Video, Audio, Sound / Microphone 3">
<path id="Vector" d="M5.83333 6.66667C5.83333 4.36548 7.69881 2.5 10 2.5C12.3012 2.5 14.1667 4.36548 14.1667 6.66667V9.16667C14.1667 11.4679 12.3012 13.3333 10 13.3333C7.69881 13.3333 5.83333 11.4679 5.83333 9.16667V6.66667Z" stroke="#5D30F7" strokeWidth="1.5"/>
<path id="Vector_2" d="M9.16667 6.66667H10.8333" stroke="#5D30F7" strokeWidth="1.5" strokeLinecap="round"/>
<path id="Vector_3" d="M8.33333 9.16667L11.6667 9.16667" stroke="#5D30F7" strokeWidth="1.5" strokeLinecap="round"/>
<path id="Vector_4" d="M16.6667 8.33333V9.16667C16.6667 12.8486 13.6819 15.8333 10 15.8333C6.3181 15.8333 3.33333 12.8486 3.33333 9.16667V8.33333" stroke="#5D30F7" strokeWidth="1.5" strokeLinecap="round"/>
<path id="Vector_5" d="M10 15.8333V18.3333" stroke="#5D30F7" strokeWidth="1.5" strokeLinecap="round"/>
</g>
</svg>`;

export function MicrophoneIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={MicrophoneIconXml} width={width} height={height} style={style} />;
}

const PromiseIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="97.1671" height="18.4867" viewBox="0 0 97.1671 18.4867" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Promise">
<path d="M5.15255 10.8053V15.2605C5.15255 15.9433 5.21126 16.4469 5.3287 16.7712C5.46082 17.0785 5.68101 17.2833 5.98928 17.3857C6.31223 17.4881 6.81868 17.5479 7.50862 17.565V18.1283C5.70303 18.0771 4.35985 18.0514 3.47907 18.0514C2.74509 18.0514 1.82027 18.0685 0.704621 18.1027L0 18.1283V17.6162C0.484427 17.582 0.836738 17.5137 1.05693 17.4113C1.29181 17.3089 1.44594 17.1126 1.51934 16.8224C1.60742 16.5322 1.65146 16.0628 1.65146 15.4141V2.71412C1.65146 2.06546 1.60742 1.59604 1.51934 1.30585C1.44594 1.01566 1.29181 0.819356 1.05693 0.716937C0.836738 0.614517 0.484427 0.546237 0 0.512097V0C0.74866 0.0512091 1.86431 0.0768137 3.34695 0.0768137L5.79111 0.0512091C6.0847 0.0341394 6.42233 0.0256046 6.804 0.0256046C8.78575 0.0256046 10.2977 0.486492 11.34 1.40827C12.3823 2.31297 12.9034 3.53347 12.9034 5.06977C12.9034 6.00861 12.6979 6.91332 12.2868 7.78389C11.8758 8.63738 11.1785 9.35432 10.195 9.9347C9.22614 10.5151 7.93433 10.8053 6.31957 10.8053H5.15255ZM6.51775 0.512097C6.1214 0.512097 5.82781 0.571842 5.63697 0.691331C5.46082 0.810821 5.33604 1.0242 5.26264 1.33145C5.18924 1.63871 5.15255 2.0996 5.15255 2.71412V10.2932H6.09938C7.28843 10.2932 8.11049 9.84935 8.56556 8.96171C9.02062 8.07407 9.24816 6.87065 9.24816 5.35142C9.24816 3.69564 9.0353 2.47514 8.60959 1.68992C8.19856 0.904706 7.50128 0.512097 6.51775 0.512097Z" fill="url(#paint0_linear_0_420)"/>
<path d="M28.3528 17.0529C28.0004 17.5308 27.6041 17.8893 27.1637 18.1283C26.7233 18.3672 26.1728 18.4867 25.5123 18.4867C24.6755 18.4867 24.0296 18.299 23.5745 17.9234C23.1195 17.5479 22.8259 17.0443 22.6938 16.4127L22.0552 13.3914C21.8937 12.4354 21.6442 11.8039 21.3065 11.4966C20.9836 11.1723 20.4992 11.0101 19.8533 11.0101H19.1266V15.4141C19.1266 16.0628 19.1633 16.5322 19.2367 16.8224C19.3248 17.1126 19.4789 17.3089 19.6991 17.4113C19.934 17.5137 20.2936 17.582 20.7781 17.6162V18.1283C19.9413 18.0771 18.745 18.0514 17.1889 18.0514C15.8237 18.0514 14.7961 18.0771 14.1062 18.1283V17.6162C14.6053 17.582 14.965 17.5137 15.1851 17.4113C15.4053 17.3089 15.5521 17.1126 15.6255 16.8224C15.7136 16.5322 15.7576 16.0628 15.7576 15.4141V5.27461C15.7576 4.62595 15.7136 4.15653 15.6255 3.86634C15.5521 3.57615 15.4053 3.37985 15.1851 3.27742C14.965 3.17501 14.6053 3.10673 14.1062 3.07259V2.56049C14.7961 2.6117 15.7797 2.6373 17.0568 2.6373L19.567 2.6117C19.8606 2.59463 20.1909 2.58609 20.5579 2.58609C22.525 2.58609 23.9929 2.93603 24.9618 3.63589C25.9453 4.31869 26.4371 5.27461 26.4371 6.50364C26.4371 7.56198 26.0481 8.49229 25.27 9.29457C24.492 10.0969 23.1929 10.609 21.3726 10.8309C21.5781 10.8309 21.791 10.8565 22.0112 10.9077C23.0681 11.0442 23.8975 11.3174 24.4994 11.727C25.1159 12.1367 25.5196 12.7854 25.7104 13.673L26.1728 15.9518C26.2756 16.4298 26.4004 16.7712 26.5472 16.976C26.694 17.1809 26.8775 17.2833 27.0977 17.2833C27.4059 17.2833 27.7215 17.0955 28.0445 16.72L28.3528 17.0529ZM20.2716 3.07259C19.9487 3.07259 19.7065 3.13233 19.545 3.25182C19.3835 3.37131 19.2734 3.58468 19.2147 3.89194C19.156 4.1992 19.1266 4.66009 19.1266 5.27461V10.498H20.0735C21.1597 10.498 21.9011 10.1737 22.2974 9.52502C22.7084 8.87636 22.914 7.96312 22.914 6.7853C22.914 5.53919 22.7084 4.60888 22.2974 3.99436C21.9011 3.37985 21.2258 3.07259 20.2716 3.07259Z" fill="url(#paint1_linear_0_420)"/>
<path d="M36.3042 2.20202C37.7868 2.20202 39.086 2.51781 40.2016 3.1494C41.3173 3.76392 42.1834 4.67716 42.7999 5.88912C43.4165 7.08402 43.7247 8.51789 43.7247 10.1907C43.7247 11.8295 43.4091 13.2804 42.7779 14.5436C42.1467 15.7897 41.2659 16.7627 40.1356 17.4625C39.0052 18.1453 37.7208 18.4867 36.2822 18.4867C34.7995 18.4867 33.5004 18.1795 32.3847 17.565C31.2691 16.9334 30.403 16.0201 29.7864 14.8252C29.1699 13.6133 28.8616 12.1709 28.8616 10.498C28.8616 8.85929 29.1772 7.41688 29.8084 6.17078C30.4397 4.9076 31.3204 3.93462 32.4508 3.25182C33.5811 2.55195 34.8656 2.20202 36.3042 2.20202ZM36.2161 2.66291C35.4528 2.66291 34.7775 2.99577 34.1903 3.6615C33.6178 4.31016 33.1701 5.2234 32.8471 6.40122C32.5389 7.56198 32.3847 8.89343 32.3847 10.3956C32.3847 11.9148 32.5609 13.2548 32.9132 14.4156C33.2655 15.5763 33.7426 16.4725 34.3444 17.1041C34.961 17.7186 35.6363 18.0258 36.3702 18.0258C37.1336 18.0258 37.8015 17.7015 38.374 17.0529C38.9612 16.3871 39.4089 15.4739 39.7172 14.3131C40.0401 13.1353 40.2016 11.7953 40.2016 10.2932C40.2016 8.77394 40.0255 7.43395 39.6732 6.2732C39.3208 5.11244 38.8364 4.22481 38.2199 3.61029C37.618 2.9787 36.9501 2.66291 36.2161 2.66291Z" fill="url(#paint2_linear_0_420)"/>
<path d="M63.1899 3.07259C62.6614 3.10673 62.2724 3.17501 62.0229 3.27742C61.788 3.37985 61.6265 3.57615 61.5384 3.86634C61.4504 4.15653 61.4063 4.62595 61.4063 5.27461V15.4141C61.4063 16.0628 61.4504 16.5322 61.5384 16.8224C61.6265 17.1126 61.788 17.3089 62.0229 17.4113C62.2724 17.5137 62.6614 17.582 63.1899 17.6162V18.1283C62.3972 18.0771 61.2889 18.0514 59.865 18.0514C58.1621 18.0514 56.9144 18.0771 56.1217 18.1283V17.6162C56.6501 17.582 57.0318 17.5137 57.2667 17.4113C57.5162 17.3089 57.685 17.1126 57.7731 16.8224C57.8612 16.5322 57.9052 16.0628 57.9052 15.4141V4.1736L52.8628 18.2563H52.5105L47.402 4.1992V14.6972C47.402 15.4483 47.4607 16.0201 47.5781 16.4127C47.6956 16.7883 47.9084 17.0614 48.2167 17.2321C48.5396 17.4028 49.0241 17.5308 49.67 17.6162V18.1283C49.0387 18.0771 48.202 18.0514 47.1598 18.0514C46.3524 18.0514 45.7138 18.0771 45.2441 18.1283V17.6162C45.7285 17.5308 46.0808 17.4028 46.301 17.2321C46.5359 17.0614 46.69 16.7883 46.7634 16.4127C46.8515 16.0372 46.8955 15.4654 46.8955 14.6972V5.27461C46.8955 4.62595 46.8515 4.15653 46.7634 3.86634C46.6753 3.57615 46.5065 3.37985 46.257 3.27742C46.0221 3.17501 45.6404 3.10673 45.1119 3.07259V2.56049C45.8753 2.6117 47.0423 2.6373 48.613 2.6373C49.3764 2.6373 50.0296 2.6117 50.5728 2.56049L54.228 12.7768L57.9052 2.6373H59.865C61.2889 2.6373 62.3972 2.6117 63.1899 2.56049V3.07259Z" fill="url(#paint3_linear_0_420)"/>
<path d="M71.2894 3.07259C70.7903 3.10673 70.4307 3.17501 70.2105 3.27742C69.9903 3.37985 69.8361 3.57615 69.7481 3.86634C69.6747 4.15653 69.638 4.62595 69.638 5.27461V15.4141C69.638 16.0628 69.6747 16.5322 69.7481 16.8224C69.8361 17.1126 69.9903 17.3089 70.2105 17.4113C70.4307 17.5137 70.7903 17.582 71.2894 17.6162V18.1283C70.5408 18.0771 69.4545 18.0514 68.0306 18.0514C66.4892 18.0514 65.3515 18.0771 64.6175 18.1283V17.6162C65.1166 17.582 65.4763 17.5137 65.6965 17.4113C65.9167 17.3089 66.0635 17.1126 66.1369 16.8224C66.225 16.5322 66.269 16.0628 66.269 15.4141V5.27461C66.269 4.62595 66.225 4.15653 66.1369 3.86634C66.0635 3.57615 65.9093 3.37985 65.6745 3.27742C65.4543 3.17501 65.102 3.10673 64.6175 3.07259V2.56049C65.3368 2.6117 66.4745 2.6373 68.0306 2.6373C69.4545 2.6373 70.5408 2.6117 71.2894 2.56049V3.07259Z" fill="url(#paint4_linear_0_420)"/>
<path d="M78.4038 2.20202C79.079 2.20202 79.6515 2.28737 80.1213 2.45807C80.6057 2.62877 81.0608 2.85921 81.4865 3.1494C81.648 3.25182 81.7874 3.33717 81.9049 3.40545C82.037 3.47373 82.1471 3.50787 82.2351 3.50787C82.3673 3.50787 82.47 3.42252 82.5434 3.25182C82.6168 3.06405 82.6755 2.77386 82.7196 2.38125H83.226C83.1526 3.40545 83.1159 5.18072 83.1159 7.70707H82.6095C82.448 6.17078 82.0223 4.96735 81.3324 4.09678C80.6424 3.20915 79.7396 2.76533 78.624 2.76533C77.89 2.76533 77.2955 2.9531 76.8404 3.32864C76.4 3.70417 76.1798 4.19067 76.1798 4.78811C76.1798 5.249 76.2972 5.67575 76.5321 6.06836C76.7817 6.4439 77.1046 6.79383 77.501 7.11816C77.8973 7.44249 78.4772 7.86923 79.2405 8.3984L79.7249 8.73127C80.6057 9.31164 81.325 9.84081 81.8828 10.3188C82.4407 10.7797 82.9031 11.3344 83.2701 11.9831C83.6371 12.6147 83.8205 13.3316 83.8205 14.1339C83.8205 15.5336 83.3214 16.609 82.3232 17.3601C81.325 18.1112 80.0112 18.4867 78.3817 18.4867C77.6771 18.4867 77.0679 18.3928 76.5541 18.2051C76.0403 18.0344 75.5192 17.7954 74.9908 17.4881C74.6238 17.2833 74.3669 17.1809 74.2201 17.1809C74.088 17.1809 73.9852 17.2748 73.9118 17.4625C73.8384 17.6332 73.7797 17.9149 73.7357 18.3075H73.2292C73.2879 17.3516 73.3173 15.269 73.3173 12.0599H73.8237C73.9265 13.8693 74.3449 15.2947 75.0788 16.3359C75.8275 17.3772 76.8771 17.8978 78.2276 17.8978C78.8882 17.8978 79.4607 17.7015 79.9451 17.3089C80.4295 16.9163 80.6718 16.3359 80.6718 15.5678C80.6718 14.885 80.4442 14.2961 79.9892 13.801C79.5341 13.306 78.7561 12.683 77.6551 11.9319C76.2605 11.0101 75.1889 10.131 74.4403 9.29457C73.7063 8.45815 73.3393 7.47663 73.3393 6.35001C73.3393 5.01856 73.809 3.99436 74.7485 3.27742C75.7027 2.56049 76.9211 2.20202 78.4038 2.20202Z" fill="url(#paint5_linear_0_420)"/>
<path d="M97.0129 14.7996C97.0129 15.7726 97.0643 16.8822 97.1671 18.1283C96.2129 18.0771 94.6055 18.0514 92.3448 18.0514C89.3208 18.0514 87.0455 18.0771 85.5188 18.1283V17.6162C86.0179 17.582 86.3776 17.5137 86.5977 17.4113C86.8179 17.3089 86.9647 17.1126 87.0381 16.8224C87.1262 16.5322 87.1702 16.0628 87.1702 15.4141V5.27461C87.1702 4.62595 87.1262 4.15653 87.0381 3.86634C86.9647 3.57615 86.8106 3.37985 86.5757 3.27742C86.3555 3.17501 86.0032 3.10673 85.5188 3.07259V2.56049C87.0455 2.6117 89.3208 2.6373 92.3448 2.6373C94.4 2.6373 95.8606 2.6117 96.7267 2.56049C96.6239 3.70417 96.5725 4.72837 96.5725 5.63308C96.5725 6.2988 96.5946 6.82797 96.6386 7.22058H96.1322C95.912 5.75256 95.5303 4.7113 94.9871 4.09678C94.444 3.46519 93.6953 3.1494 92.7412 3.1494H91.9264C91.5448 3.1494 91.2585 3.19208 91.0677 3.27742C90.8769 3.3457 90.7374 3.49933 90.6493 3.73831C90.5759 3.96022 90.5392 4.31869 90.5392 4.81372V10.0371H91.5741C92.2494 10.0371 92.7558 9.764 93.0935 9.21776C93.4458 8.65445 93.6807 8.0058 93.7981 7.27179H94.3045C94.2605 7.85217 94.2385 8.51789 94.2385 9.26897V10.2932C94.2385 11.0613 94.2825 12.0684 94.3706 13.3145H93.8641C93.7614 12.5123 93.5265 11.8551 93.1595 11.343C92.8072 10.8138 92.2787 10.5492 91.5741 10.5492H90.5392V15.875C90.5392 16.3701 90.5759 16.7371 90.6493 16.976C90.7374 17.198 90.8769 17.3516 91.0677 17.4369C91.2585 17.5052 91.5448 17.5393 91.9264 17.5393H92.8733C93.9155 17.5393 94.7303 17.1894 95.3174 16.4895C95.9193 15.7897 96.3377 14.6119 96.5725 12.9561H97.079C97.035 13.434 97.0129 14.0485 97.0129 14.7996Z" fill="url(#paint6_linear_0_420)"/>
</g>
<defs>
<linearGradient id="paint0_linear_0_420" x1="48.5835" y1="0" x2="48.5835" y2="18.4867" gradientUnits="userSpaceOnUse">
<stop offset="0.25" stop-color="#4218BF"/>
<stop offset="1" stop-color="#5D30F7"/>
</linearGradient>
<linearGradient id="paint1_linear_0_420" x1="48.5835" y1="0" x2="48.5835" y2="18.4867" gradientUnits="userSpaceOnUse">
<stop offset="0.25" stop-color="#4218BF"/>
<stop offset="1" stop-color="#5D30F7"/>
</linearGradient>
<linearGradient id="paint2_linear_0_420" x1="48.5835" y1="0" x2="48.5835" y2="18.4867" gradientUnits="userSpaceOnUse">
<stop offset="0.25" stop-color="#4218BF"/>
<stop offset="1" stop-color="#5D30F7"/>
</linearGradient>
<linearGradient id="paint3_linear_0_420" x1="48.5835" y1="0" x2="48.5835" y2="18.4867" gradientUnits="userSpaceOnUse">
<stop offset="0.25" stop-color="#4218BF"/>
<stop offset="1" stop-color="#5D30F7"/>
</linearGradient>
<linearGradient id="paint4_linear_0_420" x1="48.5835" y1="0" x2="48.5835" y2="18.4867" gradientUnits="userSpaceOnUse">
<stop offset="0.25" stop-color="#4218BF"/>
<stop offset="1" stop-color="#5D30F7"/>`;

export function PromiseIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={PromiseIconXml} width={width} height={height} style={style} />;
}

const ReceptionIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Reception">
<path id="Vector" d="M1 14.3333L14.3333 1V14.3333H1ZM9.66667 13H13V4.23333L9.66667 7.56667V13Z" fill="#E6E6E6"/>
</g>
</svg>`;

export function ReceptionIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={ReceptionIconXml} width={width} height={height} style={style} />;
}

const StarsIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="12.629" height="13.4709" viewBox="0 0 12.629 13.4709" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Weather / Stars">
<path id="Vector" d="M3.92175 1.52259C4.11895 0.989241 4.82659 0.989242 5.0238 1.52259L5.63491 3.17539C5.69512 3.33823 5.81596 3.46712 5.96861 3.53134L7.51812 4.1832C8.01813 4.39355 8.01813 5.14837 7.51812 5.35872L5.96861 6.01057C5.81596 6.07479 5.69512 6.20369 5.63491 6.36652L5.0238 8.01932C4.82659 8.55267 4.11895 8.55267 3.92175 8.01932L3.31063 6.36652C3.25043 6.20369 3.12959 6.07479 2.97693 6.01057L1.42743 5.35872C0.927413 5.14837 0.927414 4.39355 1.42743 4.1832L2.97693 3.53134C3.12959 3.46712 3.25043 3.33823 3.31063 3.17539L3.92175 1.52259Z" fill="#7C7C7C"/>
<path id="Vector_2" d="M8.90583 7.51658C9.0142 7.22348 9.40309 7.22348 9.51146 7.51658L9.98541 8.7984C10.0185 8.88789 10.0849 8.95872 10.1688 8.99401L11.3705 9.49955C11.6453 9.61515 11.6453 10.03 11.3705 10.1456L10.1688 10.6511C10.0849 10.6864 10.0185 10.7572 9.98541 10.8467L9.51146 12.1285C9.40309 12.4216 9.0142 12.4216 8.90583 12.1285L8.43189 10.8467C8.3988 10.7572 8.33239 10.6864 8.2485 10.6511L7.0468 10.1456C6.77201 10.03 6.77201 9.61515 7.0468 9.49955L8.2485 8.99401C8.33239 8.95872 8.3988 8.88789 8.43189 8.7984L8.90583 7.51658Z" fill="#7C7C7C"/>
</g>
</svg>`;

export function StarsIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={StarsIconXml} width={width} height={height} style={style} />;
}

const StarsSmallIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="6.38932" height="6.81527" viewBox="0 0 6.38932 6.81527" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Weather / Stars">
<path id="Vector" d="M1.98411 0.770315C2.08388 0.500481 2.44189 0.500481 2.54166 0.770315L2.85084 1.60651C2.8813 1.68889 2.94243 1.7541 3.01967 1.78659L3.8036 2.11638C4.05657 2.2228 4.05657 2.60468 3.8036 2.71111L3.01967 3.04089C2.94243 3.07339 2.8813 3.1386 2.85084 3.22098L2.54166 4.05717C2.44189 4.32701 2.08388 4.327 1.98411 4.05717L1.67493 3.22098C1.64447 3.1386 1.58333 3.07339 1.5061 3.04089L0.72217 2.7111C0.469201 2.60468 0.469201 2.2228 0.722171 2.11638L1.5061 1.78659C1.58333 1.7541 1.64447 1.68889 1.67493 1.60651L1.98411 0.770315Z" fill="#7C7C7C"/>
<path id="Vector_2" d="M4.50568 3.80282C4.56051 3.65454 4.75725 3.65454 4.81208 3.80282L5.05186 4.45132C5.0686 4.4966 5.1022 4.53243 5.14464 4.55029L5.75261 4.80606C5.89163 4.86454 5.89163 5.0744 5.75261 5.13289L5.14464 5.38865C5.1022 5.40651 5.0686 5.44234 5.05186 5.48762L4.81208 6.13612C4.75725 6.28441 4.56051 6.28441 4.50568 6.13612L4.2659 5.48762C4.24916 5.44234 4.21556 5.40651 4.17312 5.38865L3.56515 5.13289C3.42613 5.0744 3.42613 4.86454 3.56515 4.80606L4.17312 4.55029C4.21556 4.53243 4.24916 4.4966 4.2659 4.45132L4.50568 3.80282Z" fill="#7C7C7C"/>
</g>
</svg>`;

export function StarsSmallIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={StarsSmallIconXml} width={width} height={height} style={style} />;
}

const SubtractIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="412" height="936.187" viewBox="0 0 412 936.187" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Subtract" d="M412 936.187H0V0C0 22.6274 -0.000140377 33.9413 7.0293 40.9707C14.0587 48.0001 25.3726 48 48 48H364C386.627 48 397.941 48.0001 404.971 40.9707C412 33.9413 412 22.6274 412 0V936.187Z" fill="white"/>
</svg>`;

export function SubtractIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={SubtractIconXml} width={width} height={height} style={style} />;
}

const WifiIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Wi-Fi">
<path id="Vector" d="M8 13.3333L0 5.33333C1.05556 4.25556 2.275 3.43056 3.65833 2.85833C5.04167 2.28611 6.48889 2 8 2C9.51111 2 10.9583 2.28611 12.3417 2.85833C13.725 3.43056 14.9444 4.25556 16 5.33333L8 13.3333Z" fill="#E6E6E6"/>
</g>
</svg>`;

export function WifiIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={WifiIconXml} width={width} height={height} style={style} />;
}
