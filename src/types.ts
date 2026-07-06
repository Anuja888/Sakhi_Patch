
export interface TemperatureReading {
  id: string;
  timestamp: number;
  temperature: number;
  battery_voltage: number;
  device_id: string;
}

export interface UserProfile {
  name: string;
  age: number;
  averageCycleLength: number;
  lastPeriodDate: number; // Unix timestamp
  language: 'en' | 'hi' | 'te';
}

export interface CycleLog {
  id: string;
  startDate: number;
  endDate?: number;
  intensity: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes: string;
}

export interface DeviceInfo {
  deviceId: string;
  name: string;
  rssi?: number;
  batteryPercent: number;
  firmwareVersion: string;
  lastConnected: number;
}

export type CyclePhase = 'period' | 'follicular' | 'fertile' | 'luteal';

export interface PCOSResult {
  risk: 'low' | 'medium' | 'high';
  message: string;
}
