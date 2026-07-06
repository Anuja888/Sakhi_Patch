
import { differenceInDays, addDays, isSameDay } from 'date-fns';
import { TemperatureReading, Cycle, CyclePhase, HealthAlert, AlertSeverity } from '../types';

export class AlgorithmService {
  static getPhaseForDate(cycle: Cycle, date: Date): CyclePhase {
    const daysSinceStart = differenceInDays(date, cycle.startDate);
    
    if (daysSinceStart < 0) return CyclePhase.UNKNOWN;
    if (daysSinceStart < 5) return CyclePhase.MENSTRUATION;
    
    if (cycle.ovulationDate && isSameDay(date, cycle.ovulationDate)) {
      return CyclePhase.OVULATION;
    }
    
    if (cycle.ovulationDate && date > cycle.ovulationDate) {
      return CyclePhase.LUTEAL;
    }
    
    // Fallback: If no ovulation detected yet, assume follicular after menstruation
    if (daysSinceStart >= 5 && (!cycle.ovulationDate || date < cycle.ovulationDate)) {
      return CyclePhase.FOLLICULAR;
    }
    
    return CyclePhase.UNKNOWN;
  }

  static detectOvulation(readings: TemperatureReading[], currentCycle: Cycle): Partial<Cycle> | null {
    // Basic thermal shift detection (3 consecutive readings 0.2-0.3°C above baseline)
    if (readings.length < 10) return null;
    
    const baseline = currentCycle.baselineTemperature;
    let ovulationDate: Date | undefined = undefined;
    
    for (let i = 5; i < readings.length - 3; i++) {
      const current = readings[i].temperature;
      const next1 = readings[i+1].temperature;
      const next2 = readings[i+2].temperature;
      const next3 = readings[i+3].temperature;
      
      if (current > baseline + 0.1 && next1 > baseline + 0.2 && next2 > baseline + 0.2 && next3 > baseline + 0.2) {
        ovulationDate = readings[i].date;
        break;
      }
    }
    
    if (ovulationDate) {
      return {
        ovulationDate,
        ovulationDetected: true,
        ovulationConfidence: 85,
        lutealTemperature: baseline + 0.4,
        fertileWindowStart: addDays(ovulationDate, -5),
        fertileWindowEnd: addDays(ovulationDate, 1)
      };
    }
    
    return null;
  }

  static checkHealthAlerts(cycles: Cycle[]): HealthAlert[] {
    const alerts: HealthAlert[] = [];
    
    // Check for PCOS (Very long cycles or no ovulation)
    const longCycles = cycles.filter(c => c.lengthDays > 40 || !c.ovulationDetected);
    if (longCycles.length >= 2) {
      alerts.push({
        id: 'alert-pcos',
        title: 'Possible PCOS Detected',
        message: 'Irregular cycles and lack of ovulation shift detected over multiple months.',
        severity: AlertSeverity.HIGH,
        isRead: false,
        date: new Date(),
        recommendation: 'Please consult a healthcare provider to discuss potential PCOS or hormonal imbalances.'
      });
    }

    // Check for Luteal Phase Defect
    const shortLuteal = cycles.filter(c => c.lutealPhaseDays && c.lutealPhaseDays < 10);
    if (shortLuteal.length >= 1) {
       alerts.push({
        id: 'alert-luteal',
        title: 'Short Luteal Phase',
        message: 'The time between ovulation and your next period is shorter than 10 days.',
        severity: AlertSeverity.MEDIUM,
        isRead: false,
        date: new Date(),
        recommendation: 'A short luteal phase can make it difficult to maintain pregnancy. Track for another month and consult a doctor if it persists.'
      });
    }

    return alerts;
  }
}
