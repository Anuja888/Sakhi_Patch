
import { TemperatureReading } from '../types';
import { BLE_UUIDS, DEVICE_NAME_PREFIX } from '../constants';

type BluetoothDevice = any;
type BluetoothRemoteGATTCharacteristic = any;

export function parseTemperaturePayload(value: DataView | ArrayBuffer | Uint8Array): TemperatureReading {
  let view: DataView;

  if (value instanceof DataView) {
    view = value;
  } else if (value instanceof ArrayBuffer) {
    view = new DataView(value);
  } else if (value instanceof Uint8Array) {
    view = new DataView(value.buffer, value.byteOffset, value.byteLength);
  } else {
    throw new Error('Unsupported BLE payload type.');
  }

  if (view.byteLength < 8) {
    throw new Error(`BLE payload was too short (${view.byteLength} bytes).`);
  }

  const timestamp = view.getUint32(0, true);
  const tempRaw = view.getInt16(4, true);
  const batteryRaw = view.getInt16(6, true);

  return {
    id: Math.random().toString(36).slice(2, 10),
    timestamp,
    temperature: Number((tempRaw / 100).toFixed(2)),
    battery_voltage: Number((batteryRaw / 1000).toFixed(3)),
    device_id: 'unknown',
  };
}

export class BLEService {
  private static instance: BLEService;
  private device: BluetoothDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private onDataCallback: ((reading: TemperatureReading) => void) | null = null;
  private reconnectAttempts = 0;

  static getInstance() {
    if (!this.instance) this.instance = new BLEService();
    return this.instance;
  }

  async scanAndConnect(): Promise<BluetoothDevice> {
    const nav = navigator as any;
    if (!nav.bluetooth) {
      throw new Error('Web Bluetooth is not supported in this browser.');
    }

    try {
      const device = await nav.bluetooth.requestDevice({
        filters: [{ namePrefix: DEVICE_NAME_PREFIX }],
        optionalServices: [BLE_UUIDS.SERVICE],
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService(BLE_UUIDS.SERVICE);
      const char = await service?.getCharacteristic(BLE_UUIDS.CHARACTERISTIC);

      this.device = device;
      this.characteristic = char ?? null;
      this.reconnectAttempts = 0;
      return device;
    } catch (error) {
      console.error('BLE Connection Error:', error);
      throw new Error(error instanceof Error ? error.message : 'Bluetooth connection failed.');
    }
  }

  async startNotifications(callback: (reading: TemperatureReading) => void) {
    this.onDataCallback = callback;
    if (this.characteristic) {
      try {
        await this.characteristic.startNotifications();
        this.characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target.value as DataView;
          const reading = parseTemperaturePayload(value);
          reading.device_id = this.device?.id || 'unknown';
          if (this.onDataCallback) this.onDataCallback(reading);
        });
      } catch (error) {
        console.error('BLE notification error:', error);
        throw error;
      }
    }
  }

  async reconnect(): Promise<void> {
    if (!this.device?.gatt) {
      throw new Error('No device is currently connected.');
    }

    try {
      await this.device.gatt.connect();
      this.reconnectAttempts = 0;
    } catch (error) {
      this.reconnectAttempts += 1;
      if (this.reconnectAttempts >= 3) {
        throw new Error('Failed to reconnect after several attempts.');
      }
      console.warn('BLE reconnect attempt failed, retrying...', error);
      throw error;
    }
  }

  disconnect() {
    try {
      if (this.device?.gatt?.connected) {
        this.device.gatt.disconnect();
      }
    } catch (error) {
      console.warn('BLE disconnect warning:', error);
    } finally {
      this.device = null;
      this.characteristic = null;
      this.onDataCallback = null;
      this.reconnectAttempts = 0;
    }
  }

  simulateData(): TemperatureReading {
    return {
      id: Math.random().toString(36).slice(2, 10),
      timestamp: Date.now() / 1000,
      temperature: Number((36.5 + Math.random() * 0.5).toFixed(2)),
      battery_voltage: Number((3.7 + Math.random() * 0.4).toFixed(3)),
      device_id: 'SIMULATED-001',
    };
  }
}
