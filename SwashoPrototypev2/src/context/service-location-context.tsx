import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  DEFAULT_SERVICE_ADDRESS_ID,
  DEMO_SAVED_SERVICE_ADDRESSES,
  type SavedServiceAddress,
} from '@/data/mock-user';
import {
  readLocationPermissionState,
  requestEnableDeviceLocation,
  type LocationPermissionState,
} from '@/lib/device-location';

type ServiceLocationContextValue = {
  savedAddresses: SavedServiceAddress[];
  selectedAddressId: string;
  selectedAddress: SavedServiceAddress;
  homeLabel: string;
  homeAddressLine: string;
  setSelectedAddressId: (id: string) => void;
  locationPermission: LocationPermissionState;
  deviceLocationSummary: string | null;
  isEnablingLocation: boolean;
  locationFeedback: string | null;
  clearLocationFeedback: () => void;
  requestEnableLocation: () => Promise<void>;
  refreshPermissionStatus: () => Promise<void>;
};

const ServiceLocationContext = createContext<ServiceLocationContextValue | null>(null);

function findAddress(id: string): SavedServiceAddress {
  return (
    DEMO_SAVED_SERVICE_ADDRESSES.find((address) => address.id === id) ??
    DEMO_SAVED_SERVICE_ADDRESSES[0]
  );
}

export function ServiceLocationProvider({ children }: { children: ReactNode }) {
  const [selectedAddressId, setSelectedAddressIdState] = useState(DEFAULT_SERVICE_ADDRESS_ID);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionState>('undetermined');
  const [deviceLocationSummary, setDeviceLocationSummary] = useState<string | null>(null);
  const [isEnablingLocation, setIsEnablingLocation] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);

  const refreshPermissionStatus = useCallback(async () => {
    const next = await readLocationPermissionState();
    setLocationPermission(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void readLocationPermissionState().then((next) => {
      if (!cancelled) {
        setLocationPermission(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setSelectedAddressId = useCallback((id: string) => {
    if (!DEMO_SAVED_SERVICE_ADDRESSES.some((address) => address.id === id)) {
      return;
    }
    setSelectedAddressIdState(id);
  }, []);

  const clearLocationFeedback = useCallback(() => {
    setLocationFeedback(null);
  }, []);

  const requestEnableLocation = useCallback(async () => {
    setIsEnablingLocation(true);
    setLocationFeedback(null);
    try {
      const result = await requestEnableDeviceLocation();
      if (result.outcome === 'granted') {
        setLocationPermission('granted');
        setDeviceLocationSummary(result.summary);
        setLocationFeedback(
          result.summary
            ? `Location enabled. Device reads: ${result.summary}`
            : 'Location enabled.',
        );
        return;
      }
      if (result.outcome === 'denied') {
        setLocationPermission('denied');
        setLocationFeedback('Location permission was denied. You can still choose a saved address.');
        return;
      }
      if (result.outcome === 'blocked') {
        setLocationPermission('blocked');
        setLocationFeedback(
          'Location is blocked for this app. Enable it in system settings or pick a saved address.',
        );
        return;
      }
      if (result.outcome === 'unavailable') {
        setLocationPermission('unavailable');
        setLocationFeedback('Device location is unavailable on this platform or device.');
        return;
      }
      setLocationFeedback(result.message);
    } finally {
      setIsEnablingLocation(false);
      void refreshPermissionStatus();
    }
  }, [refreshPermissionStatus]);

  const selectedAddress = useMemo(() => findAddress(selectedAddressId), [selectedAddressId]);

  const value = useMemo<ServiceLocationContextValue>(
    () => ({
      savedAddresses: DEMO_SAVED_SERVICE_ADDRESSES,
      selectedAddressId,
      selectedAddress,
      homeLabel: selectedAddress.label,
      homeAddressLine: selectedAddress.headerLine,
      setSelectedAddressId,
      locationPermission,
      deviceLocationSummary,
      isEnablingLocation,
      locationFeedback,
      clearLocationFeedback,
      requestEnableLocation,
      refreshPermissionStatus,
    }),
    [
      clearLocationFeedback,
      deviceLocationSummary,
      isEnablingLocation,
      locationFeedback,
      locationPermission,
      refreshPermissionStatus,
      requestEnableLocation,
      selectedAddress,
      selectedAddressId,
      setSelectedAddressId,
    ],
  );

  return <ServiceLocationContext.Provider value={value}>{children}</ServiceLocationContext.Provider>;
}

export function useServiceLocation(): ServiceLocationContextValue {
  const ctx = useContext(ServiceLocationContext);
  if (!ctx) {
    throw new Error('useServiceLocation must be used within ServiceLocationProvider');
  }
  return ctx;
}
