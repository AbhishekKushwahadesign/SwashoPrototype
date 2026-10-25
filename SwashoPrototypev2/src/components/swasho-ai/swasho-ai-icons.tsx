import { SvgXml } from 'react-native-svg';

type IconProps = {
  width: number;
  height: number;
  style?: object;
};

const HistoryIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Time / History">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.0788 5.06899C8.87413 1.27901 15.0438 1.31931 18.8623 5.13786C22.6825 8.95805 22.7212 15.1314 18.9263 18.9263C15.1314 22.7212 8.95805 22.6825 5.13786 18.8623C2.87401 16.5985 1.93916 13.51 2.34059 10.5813C2.39684 10.1709 2.77511 9.88385 3.18549 9.9401C3.59587 9.99635 3.88294 10.3746 3.82669 10.785C3.48672 13.2653 4.27794 15.8811 6.19852 17.8017C9.443 21.0461 14.6665 21.0647 17.8656 17.8656C21.0647 14.6665 21.0461 9.443 17.8017 6.19852C14.5588 2.9557 9.33901 2.93547 6.13947 6.12965L6.88717 6.13341C7.30138 6.13549 7.63547 6.47296 7.63339 6.88717C7.63131 7.30138 7.29384 7.63547 6.87963 7.63339L4.33408 7.6206C3.92281 7.61853 3.58992 7.28564 3.58786 6.87438L3.57507 4.32882C3.57298 3.91462 3.90708 3.57715 4.32129 3.57506C4.7355 3.57298 5.07296 3.90708 5.07505 4.32129L5.0788 5.06899ZM12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.25 12.3107V8C11.25 7.58579 11.5858 7.25 12 7.25Z" fill="#3D3D3D"/>
</g>
</svg>`;

const ScannerIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Security / Scanner">
<path d="M13.3333 29.3333C8.30502 29.3333 5.79086 29.3333 4.22876 27.7712C2.66667 26.2091 2.66667 25.0283 2.66667 20" stroke-width="2" stroke-linecap="round" stroke="#5D30F7"/>
<path d="M29.3333 20C29.3333 25.0283 29.3333 26.2091 27.7712 27.7712C26.2091 29.3333 23.695 29.3333 18.6667 29.3333" stroke-width="2" stroke-linecap="round" stroke="#5D30F7"/>
<path d="M18.6667 2.66667C23.695 2.66667 26.2091 2.66667 27.7712 4.22876C29.3333 5.79086 29.3333 6.97169 29.3333 12" stroke-width="2" stroke-linecap="round" stroke="#5D30F7"/>
<path d="M13.3333 2.66667C8.30502 2.66667 5.79086 2.66667 4.22876 4.22876C2.66667 5.79086 2.66667 6.97169 2.66667 12" stroke-width="2" stroke-linecap="round" stroke="#5D30F7"/>
<path d="M2.66667 16H29.3333" stroke-width="2" stroke-linecap="round" stroke="#5D30F7"/>
</g>
</svg>`;

const SparkleBulletIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20.3471" height="20.231" viewBox="0 0 20.3471 20.231" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.05294 1.1669C9.4547 0.128783 10.9308 0.149673 11.303 1.19874L13.0908 6.23744C13.2087 6.56981 13.4669 6.83348 13.7967 6.95839L19.1722 8.99427C20.2158 9.38954 20.202 10.8707 19.1511 11.2464L13.8179 13.1532C13.4757 13.2755 13.2074 13.5463 13.0882 13.8896L11.3056 19.0246C10.9377 20.0841 9.44685 20.1048 9.04969 19.056L7.0815 13.8582C6.95846 13.5332 6.70062 13.2776 6.37464 13.1573L1.18462 11.2424C0.149094 10.8604 0.135131 9.40075 1.16316 8.99894L6.39608 6.95365C6.7094 6.83119 6.95694 6.58282 7.07835 6.26909L9.05294 1.1669Z" fill="url(#paint0_radial_swasho_ai_sparkle)"/>
<defs>
<radialGradient id="paint0_radial_swasho_ai_sparkle" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.50518 3.71517) rotate(78.6036) scale(18.8046)">
<stop stop-color="#D5D4FF"/>
<stop offset="1" stop-color="#5D30F7"/>
</radialGradient>
</defs>
</svg>`;

export function HistoryIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={HistoryIconXml} width={width} height={height} style={style} />;
}

export function ScannerIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={ScannerIconXml} width={width} height={height} style={style} />;
}

export function SparkleBulletIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={SparkleBulletIconXml} width={width} height={height} style={style} />;
}
