import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 0.85,
};

async function launchLibrary(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Photo library access',
      'Allow photo library access in your device settings to choose an existing garment photo.',
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }
  return result.assets[0].uri;
}

async function launchCamera(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets[0]?.uri) {
    return null;
  }
  return result.assets[0].uri;
}

function promptLibraryFallback(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'Camera access',
      'Enable camera access in Settings to capture garment photos, or choose an existing photo from your library.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Photo library', onPress: () => resolve(true) },
      ],
    );
  });
}

/** Opens camera first; gallery only when permission denied and user opts in. */
export function usePickGarmentPhoto() {
  const pickPhoto = useCallback(async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.granted) {
        const fromCamera = await launchCamera();
        if (fromCamera) {
          return fromCamera;
        }
      }
      return launchLibrary();
    }

    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted) {
      return launchCamera();
    }

    const useLibrary = await promptLibraryFallback();
    if (!useLibrary) {
      return null;
    }
    return launchLibrary();
  }, []);

  return { pickPhoto };
}
