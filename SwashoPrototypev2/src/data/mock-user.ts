/** Prototype user shown on Home header and Profile (Figma 3415:17381). */
export const DEMO_USER = {
  displayName: 'Abhishek kushwaha',
  phone: '+91 1234567890',
  avatarInitial: 'A',
  homeLabel: 'Home',
  homeAddressLine: '2O1, lodha luxuria, kolshet road',
} as const;

export type DemoUser = typeof DEMO_USER;

export type SavedServiceAddress = {
  id: string;
  label: string;
  /** Short single-line label on Home header. */
  headerLine: string;
  /** Full address row in location modal (Figma 3445:11082). */
  fullLine: string;
};

/** Saved service addresses for Home location selection (Figma 3445:11076). */
export const DEMO_SAVED_SERVICE_ADDRESSES: SavedServiceAddress[] = [
  {
    id: 'home',
    label: 'Home',
    headerLine: '2O1, lodha luxuria, kolshet road',
    fullLine:
      '2O1, Lodha Luxuria, kolshet road Dhokali, Thane West  400607  | XXXXX 12345',
  },
];

export const DEFAULT_SERVICE_ADDRESS_ID = 'home';
