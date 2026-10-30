import * as Location from 'expo-location';
import { Platform } from 'react-native';

export type LocationPermissionState =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export type EnableLocationResult =
  | { outcome: 'granted'; summary: string | null }
  | { outcome: 'denied' }
  | { outcome: 'blocked' }
  | { outcome: 'unavailable' }
  | { outcome: 'error'; message: string };

function permissionStateFromStatus(
  status: Location.PermissionStatus,
  canAskAgain: boolean,
): LocationPermissionState {
  if (status === Location.PermissionStatus.GRANTED) {
    return 'granted';
  }
  if (status === Location.PermissionStatus.DENIED) {
    return canAskAgain ? 'denied' : 'blocked';
  }
  return 'undetermined';
}

export async function readLocationPermissionState(): Promise<LocationPermissionState> {
  if (Platform.OS === 'web') {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return 'unavailable';
    }
    if (typeof navigator.permissions?.query !== 'function') {
      return 'undetermined';
    }
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      if (result.state === 'granted') {
        return 'granted';
      }
      if (result.state === 'denied') {
        return 'blocked';
      }
      return 'undetermined';
    } catch {
      return 'undetermined';
    }
  }

  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    return permissionStateFromStatus(status, canAskAgain);
  } catch {
    return 'unavailable';
  }
}

function formatReverseGeocode(place: Location.LocationGeocodedAddress): string | null {
  const parts = [
    place.name,
    place.street,
    place.district,
    place.city,
    place.region,
    place.postalCode,
  ].filter((part) => part && String(part).trim().length > 0);
  if (parts.length === 0) {
    return null;
  }
  return parts.join(', ');
}

async function reverseGeocodeSummary(latitude: number, longitude: number): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (!results.length) {
      return null;
    }
    return formatReverseGeocode(results[0]);
  } catch {
    return null;
  }
}

async function readCurrentPositionSummary(): Promise<string | null> {
  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return reverseGeocodeSummary(position.coords.latitude, position.coords.longitude);
  } catch {
    return null;
  }
}

/** Requests foreground location permission only when invoked (explicit user action). */
export async function requestEnableDeviceLocation(): Promise<EnableLocationResult> {
  if (Platform.OS === 'web') {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return { outcome: 'unavailable' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const summary = await reverseGeocodeSummary(position.coords.latitude, position.coords.longitude);
          resolve({ outcome: 'granted', summary });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            resolve({ outcome: 'denied' });
            return;
          }
          if (error.code === error.POSITION_UNAVAILABLE) {
            resolve({ outcome: 'unavailable' });
            return;
          }
          resolve({ outcome: 'error', message: error.message || 'Location request failed' });
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
      );
    });
  }

  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      return { outcome: 'unavailable' };
    }

    const current = await Location.getForegroundPermissionsAsync();
    let status = current.status;
    let canAskAgain = current.canAskAgain;

    if (status !== Location.PermissionStatus.GRANTED) {
      const requested = await Location.requestForegroundPermissionsAsync();
      status = requested.status;
      canAskAgain = requested.canAskAgain;
    }

    if (status !== Location.PermissionStatus.GRANTED) {
      return { outcome: canAskAgain ? 'denied' : 'blocked' };
    }

    const summary = await readCurrentPositionSummary();
    return { outcome: 'granted', summary };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Location request failed';
    return { outcome: 'error', message };
  }
}
