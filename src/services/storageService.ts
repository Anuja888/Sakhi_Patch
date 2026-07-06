
import { TemperatureReading, UserProfile, CycleLog, DeviceInfo } from '../types';

const KEYS = {
  READINGS: 'saheli_readings',
  PROFILE: 'saheli_profile',
  CYCLE_LOGS: 'saheli_cycle_logs',
  DEVICE: 'saheli_device',
};

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Storage unavailable:', error);
    return null;
  }
};

const readJson = <T>(key: string, fallback: T): T => {
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    const data = storage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.warn(`Unable to read storage key ${key}:`, error);
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Unable to save storage key ${key}:`, error);
  }
};

const removeKey = (key: string) => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`Unable to clear storage key ${key}:`, error);
  }
};

const buildDemoReadings = (now: number): TemperatureReading[] => {
  const dayMs = 24 * 60 * 60 * 1000;
  const baseTemp = 36.4;
  return [
    { id: 'demo-1', timestamp: Math.floor((now - 6 * dayMs) / 1000), temperature: 36.3, battery_voltage: 3.7, device_id: 'demo-device' },
    { id: 'demo-2', timestamp: Math.floor((now - 5 * dayMs) / 1000), temperature: 36.4, battery_voltage: 3.7, device_id: 'demo-device' },
    { id: 'demo-3', timestamp: Math.floor((now - 4 * dayMs) / 1000), temperature: 36.5, battery_voltage: 3.7, device_id: 'demo-device' },
    { id: 'demo-4', timestamp: Math.floor((now - 3 * dayMs) / 1000), temperature: 36.6, battery_voltage: 3.7, device_id: 'demo-device' },
    { id: 'demo-5', timestamp: Math.floor((now - 2 * dayMs) / 1000), temperature: 36.7, battery_voltage: 3.7, device_id: 'demo-device' },
    { id: 'demo-6', timestamp: Math.floor((now - 1 * dayMs) / 1000), temperature: 36.8, battery_voltage: 3.7, device_id: 'demo-device' },
  ].map((item, index) => ({
    ...item,
    temperature: Number((baseTemp + index * 0.05).toFixed(1)),
  }));
};

export const storageService = {
  getDefaultProfile: (): UserProfile => ({
    name: 'Demo User',
    age: 29,
    averageCycleLength: 28,
    lastPeriodDate: Date.now() - 18 * 24 * 60 * 60 * 1000,
    language: 'en',
  }),

  getReadings: (): TemperatureReading[] => readJson(KEYS.READINGS, []),

  saveReadings: (readings: TemperatureReading[]) => {
    writeJson(KEYS.READINGS, readings);
  },

  addReading: (reading: TemperatureReading) => {
    const current = storageService.getReadings();
    storageService.saveReadings([...current, reading]);
  },

  getProfile: (): UserProfile => readJson(KEYS.PROFILE, storageService.getDefaultProfile()),

  saveProfile: (profile: UserProfile) => {
    writeJson(KEYS.PROFILE, profile);
  },

  getCycleLogs: (): CycleLog[] => readJson(KEYS.CYCLE_LOGS, []),

  saveCycleLogs: (logs: CycleLog[]) => {
    writeJson(KEYS.CYCLE_LOGS, logs);
  },

  getDeviceInfo: (): DeviceInfo | null => readJson(KEYS.DEVICE, null),

  saveDeviceInfo: (info: DeviceInfo | null) => {
    if (info) writeJson(KEYS.DEVICE, info);
    else removeKey(KEYS.DEVICE);
  },

  seedDemoData: () => {
    const now = Date.now();
    const storage = getStorage();
    const rawReadings = storage?.getItem(KEYS.READINGS);
    const hasStoredReadings = Boolean(rawReadings && rawReadings !== '[]');
    const hasStoredProfile = Boolean(storage?.getItem(KEYS.PROFILE));
    const hasStoredDevice = Boolean(storage?.getItem(KEYS.DEVICE));
    const hasStoredData = hasStoredReadings || hasStoredProfile || hasStoredDevice;

    if (hasStoredData) {
      return {
        profile: storageService.getProfile(),
        readings: storageService.getReadings(),
        device: storageService.getDeviceInfo(),
      };
    }

    const profile = storageService.getDefaultProfile();
    const readings = buildDemoReadings(now);
    const device: DeviceInfo = {
      deviceId: 'demo-device',
      name: 'SakhiPatch Demo',
      batteryPercent: 92,
      firmwareVersion: 'v1.0.0',
      lastConnected: now,
    };

    storageService.saveProfile(profile);
    storageService.saveReadings(readings);
    storageService.saveDeviceInfo(device);

    return { profile, readings, device };
  },

  clearAllData: () => {
    Object.values(KEYS).forEach(removeKey);
  },
};
