import { TemperatureReading } from '../types';
import { BLE_UUIDS, DEVICE_NAME_PREFIX } from '../constants';

let BleManager: any = null;
try {
  BleManager = require('react-native-ble-plx').BleManager;
} catch (e) {
  console.warn('react-native-ble-plx not available in this environment. BLE features disabled.');
  BleManager = null;
}

export class BLEServiceNative {
  private static instance: BLEServiceNative;
  private bleManager: any = null;
  private scannedDevices: Map<string, any> = new Map();
  private onDataCallback: ((reading: TemperatureReading) => void) | null = null;

  private constructor() {
    if (BleManager) {
      this.bleManager = new BleManager();
    } else {
      this.bleManager = null;
    }
  }

  static getInstance() {
    if (!this.instance) this.instance = new BLEServiceNative();
    return this.instance;
  }

  async scanAndConnect(): Promise<any> {
    if (!this.bleManager) {
      console.warn('BLE manager not available; returning null');
      return null;
    }

    try {
      this.bleManager.startDeviceScan(
        [BLE_UUIDS.SERVICE],
        null,
        async (error: any, device: any) => {
          if (error) {
            console.error('BLE Scan Error:', error);
            return;
          }

          if (device && device.name?.startsWith(DEVICE_NAME_PREFIX)) {
            this.scannedDevices.set(device.id, device);
            this.bleManager.stopDeviceScan();
            await this.connect(device);
          }
        }
      );

      // Wait for device connection
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.bleManager.stopDeviceScan();
          resolve(null);
        }, 10000);
      });
    } catch (error) {
      console.error('BLE Connection Error:', error);
      throw error;
    }
  }

  private async connect(device: any) {
    if (!this.bleManager) return;
    try {
      const connected = await device.connect();
      const services = await connected.discoverAllServicesAndCharacteristics();
      
      const service = await services.characteristicsForService(BLE_UUIDS.SERVICE);
      const characteristic = service.find((c: any) => c.uuid === BLE_UUIDS.CHARACTERISTIC);

      if (characteristic) {
        await characteristic.monitor((error: any, char: any) => {
          if (error) {
            console.error('Monitor Error:', error);
            return;
          }
          if (char?.value) {
            try {
              const buf = Buffer.from(char.value, 'base64');
              const reading = this.parseValue(buf);
              if (this.onDataCallback) this.onDataCallback(reading);
            } catch (e) {
              console.error('Error parsing characteristic value', e);
            }
          }
        });
      }
    } catch (error) {
      console.error('Connect Error:', error);
    }
  }

  async startNotifications(callback: (reading: TemperatureReading) => void) {
    this.onDataCallback = callback;
  }

  private parseValue(value: Buffer): TemperatureReading {
    const timestamp = value.readUInt32LE(0);
    const tempRaw = value.readInt16LE(4);
    const batteryRaw = value.readInt16LE(6);

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp,
      temperature: tempRaw / 100,
      battery_voltage: batteryRaw / 1000,
      device_id: 'native-device'
    };
  }

  async disconnect() {
    try {
      if (this.bleManager && this.bleManager.destroy) await this.bleManager.destroy();
    } catch (error) {
      console.error('Disconnect Error:', error);
    }
  }

  simulateData(): TemperatureReading {
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now() / 1000,
      temperature: 36.5 + (Math.random() * 0.5),
      battery_voltage: 3.7 + (Math.random() * 0.4),
      device_id: 'SIMULATED-001'
    };
  }
}
