import { TemperatureReading, UserProfile, CycleLog, DeviceInfo } from '../types';

let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.warn('AsyncStorage not available, falling back to in-memory store');
  AsyncStorage = null;
}

const memoryStore: Record<string, string> = {};

const KEYS = {
  READINGS: 'saheli_readings',
  PROFILE: 'saheli_profile',
  CYCLE_LOGS: 'saheli_cycle_logs',
  DEVICE: 'saheli_device',
};

const readStoredJson = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    if (AsyncStorage) {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    }
    const data = memoryStore[key];
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.warn(`Unable to read native storage key ${key}:`, error);
    return fallback;
  }
};

const writeStoredJson = async (key: string, value: unknown) => {
  try {
    const data = JSON.stringify(value);
    if (AsyncStorage) {
      await AsyncStorage.setItem(key, data);
    } else {
      memoryStore[key] = data;
    }
  } catch (error) {
    console.warn(`Unable to write native storage key ${key}:`, error);
  }
};

const removeStoredKey = async (key: string) => {
  try {
    if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  } catch (error) {
    console.warn(`Unable to clear native storage key ${key}:`, error);
  }
};

export const storageService = {
  getDefaultProfile: (): UserProfile => ({
    name: 'Guest User',
    age: 25,
    averageCycleLength: 28,
    lastPeriodDate: Date.now() - 18 * 24 * 60 * 60 * 1000,
    language: 'en',
  }),

  getReadings: async (): Promise<TemperatureReading[]> => readStoredJson(KEYS.READINGS, []),

  saveReadings: async (readings: TemperatureReading[]) => writeStoredJson(KEYS.READINGS, readings),

  addReading: async (reading: TemperatureReading) => {
    const current = await storageService.getReadings();
    await storageService.saveReadings([...current, reading]);
  },

  getProfile: (): UserProfile => storageService.getDefaultProfile(),

  getProfileAsync: async (): Promise<UserProfile> => readStoredJson(KEYS.PROFILE, storageService.getDefaultProfile()),

  saveProfile: async (profile: UserProfile) => writeStoredJson(KEYS.PROFILE, profile),

  getCycleLogs: async (): Promise<CycleLog[]> => readStoredJson(KEYS.CYCLE_LOGS, []),

  saveCycleLogs: async (logs: CycleLog[]) => writeStoredJson(KEYS.CYCLE_LOGS, logs),

  getDeviceInfo: async (): Promise<DeviceInfo | null> => readStoredJson(KEYS.DEVICE, null),

  saveDeviceInfo: async (info: DeviceInfo | null) => {
    if (info) {
      await writeStoredJson(KEYS.DEVICE, info);
    } else {
      await removeStoredKey(KEYS.DEVICE);
    }
  },

  clearAllData: async () => {
    await Promise.all(Object.values(KEYS).map(removeStoredKey));
  },
};
