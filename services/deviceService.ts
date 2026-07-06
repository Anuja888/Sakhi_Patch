
import { TemperatureReading } from '../types';
import { DEVICE_CONFIG } from '../constants';

export class DeviceService {
  static async checkConnection(): Promise<boolean> {
    try {
      // Use a controller to abort if it takes too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${DEVICE_CONFIG.BASE_URL}/api/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Device not found at IP:', DEVICE_CONFIG.IP);
      return false;
    }
  }

  static async syncData(): Promise<TemperatureReading[]> {
    try {
      const response = await fetch(`${DEVICE_CONFIG.BASE_URL}/api/data`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch data from device');

      const data = await response.json();
      return data.readings.map((reading: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        date: new Date(reading.timestamp * 1000),
        temperature: reading.temperature,
        time: new Date(reading.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: `Synced from Saheli Patch`,
        timestamp: new Date(reading.timestamp * 1000)
      }));
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  static async clearDeviceData(): Promise<boolean> {
    try {
      const response = await fetch(`${DEVICE_CONFIG.BASE_URL}/api/clear`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
