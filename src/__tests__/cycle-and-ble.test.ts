// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { analyzeCycle } from '../hooks/useCycleLogic';
import { parseTemperaturePayload } from '../services/bleService';

const profile = {
  name: 'Demo User',
  age: 29,
  averageCycleLength: 28,
  lastPeriodDate: Date.now() - 14 * 24 * 60 * 60 * 1000,
  language: 'en' as const,
};

describe('analyzeCycle', () => {
  it('returns an insufficient-data message when there are no readings', () => {
    const result = analyzeCycle({ readings: [], profile, now: Date.now() });

    expect(result.hasSufficientData).toBe(false);
    expect(result.phase).toBe('follicular');
    expect(result.pcosResult.message).toContain('Insufficient');
  });

  it('detects a luteal phase when a clear temperature shift is present', () => {
    const now = Date.now();
    const readings = [
      { id: 'a', timestamp: now / 1000 - 5 * 24 * 60 * 60, temperature: 36.3, battery_voltage: 3.7, device_id: 'demo' },
      { id: 'b', timestamp: now / 1000 - 2 * 24 * 60 * 60, temperature: 36.7, battery_voltage: 3.7, device_id: 'demo' },
    ];

    const result = analyzeCycle({ readings, profile, now });

    expect(result.phase).toBe('luteal');
    expect(result.dayOfCycle).toBeGreaterThan(0);
  });
});

describe('parseTemperaturePayload', () => {
  it('parses a standard temperature payload into a reading', () => {
    const bytes = new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x2c, 0x01, 0xE8, 0x03]);
    const view = new DataView(bytes.buffer);

    const result = parseTemperaturePayload(view);

    expect(result.temperature).toBe(300 / 100);
    expect(result.battery_voltage).toBe(1000 / 1000);
    expect(result.timestamp).toBe(1);
  });
});
