
import { TemperatureReading, Cycle, HealthAlert, UserProfile } from '../types';

const KEYS = {
  TEMPERATURES: 'saheli_temperatures',
  CYCLES: 'saheli_cycles',
  ALERTS: 'saheli_alerts',
  USER_PROFILE: 'saheli_user_profile',
  DEMO_MODE: 'saheli_demo_mode'
};

export class StorageService {
  static saveTemperatures(data: TemperatureReading[]) {
    localStorage.setItem(KEYS.TEMPERATURES, JSON.stringify(data));
  }

  static getTemperatures(): TemperatureReading[] {
    const data = localStorage.getItem(KEYS.TEMPERATURES);
    if (!data) return [];
    return JSON.parse(data).map((t: any) => ({
      ...t,
      date: new Date(t.date),
      timestamp: new Date(t.timestamp)
    }));
  }

  static saveCycles(data: Cycle[]) {
    localStorage.setItem(KEYS.CYCLES, JSON.stringify(data));
  }

  static getCycles(): Cycle[] {
    const data = localStorage.getItem(KEYS.CYCLES);
    if (!data) return [];
    return JSON.parse(data).map((c: any) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: c.endDate ? new Date(c.endDate) : undefined,
      ovulationDate: c.ovulationDate ? new Date(c.ovulationDate) : undefined,
      fertileWindowStart: c.fertileWindowStart ? new Date(c.fertileWindowStart) : undefined,
      fertileWindowEnd: c.fertileWindowEnd ? new Date(c.fertileWindowEnd) : undefined
    }));
  }

  static saveAlerts(data: HealthAlert[]) {
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(data));
  }

  static getAlerts(): HealthAlert[] {
    const data = localStorage.getItem(KEYS.ALERTS);
    if (!data) return [];
    return JSON.parse(data).map((a: any) => ({
      ...a,
      date: new Date(a.date)
    }));
  }

  static saveProfile(profile: UserProfile) {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  static getProfile(): UserProfile | null {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    if (!data) return null;
    const profile = JSON.parse(data);
    return {
      ...profile,
      lastPeriodStart: new Date(profile.lastPeriodStart)
    };
  }

  static isDemoMode(): boolean {
    return localStorage.getItem(KEYS.DEMO_MODE) === 'true';
  }

  static setDemoMode(val: boolean) {
    localStorage.setItem(KEYS.DEMO_MODE, val.toString());
  }

  static clearAll() {
    localStorage.clear();
  }
}
