
export enum CyclePhase {
  MENSTRUATION = 'MENSTRUATION',
  FOLLICULAR = 'FOLLICULAR',
  OVULATION = 'OVULATION',
  LUTEAL = 'LUTEAL',
  UNKNOWN = 'UNKNOWN'
}

export interface TemperatureReading {
  id: string;
  date: Date;
  temperature: number;
  time: string;
  notes?: string;
  timestamp: Date;
}

export interface Cycle {
  id: string;
  startDate: Date;
  endDate?: Date;
  lengthDays: number;
  ovulationDetected: boolean;
  ovulationDate?: Date;
  ovulationConfidence: number;
  baselineTemperature: number;
  lutealTemperature?: number;
  lutealPhaseDays?: number;
  fertileWindowStart?: Date;
  fertileWindowEnd?: Date;
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface HealthAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  isRead: boolean;
  date: Date;
  recommendation?: string;
}

export interface UserProfile {
  name?: string;
  lastPeriodStart: Date;
  avgCycleLength: number;
  hasDevice: boolean;
  onboardingComplete: boolean;
}
