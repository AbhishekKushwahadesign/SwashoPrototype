/** Prototype user shown on Home header and Profile (Figma 3415:17381). */
export const DEMO_USER = {
  displayName: 'Abhishek kushwaha',
  phone: '+91 1234567890',
  avatarInitial: 'A',
  homeLabel: 'Home',
  homeAddressLine: '2O1, lodha luxuria, kolshet road',
} as const;

export type DemoUser = typeof DEMO_USER;
