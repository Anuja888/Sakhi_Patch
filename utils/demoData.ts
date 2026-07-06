
import { subDays, addDays } from 'date-fns';
import { TemperatureReading, Cycle, HealthAlert, AlertSeverity } from '../types';

export function generateDemoData(): {
  temperatures: TemperatureReading[];
  cycles: Cycle[];
  alerts: HealthAlert[];
} {
  const temperatures: TemperatureReading[] = [];
  const cycles: Cycle[] = [];
  
  const now = new Date();
  const cycle1Start = subDays(now, 45); // Started 45 days ago
  
  // Cycle 1: Complete 28 days
  for (let i = 0; i < 28; i++) {
    const date = addDays(cycle1Start, i);
    let temp = 36.3 + (Math.random() * 0.1);
    if (i > 14) temp += 0.4; // Elevated in luteal
    
    temperatures.push({
      id: `t1-${i}`,
      date,
      temperature: parseFloat(temp.toFixed(2)),
      time: '08:30 AM',
      timestamp: date
    });
  }
  
  cycles.push({
    id: 'cycle-1',
    startDate: cycle1Start,
    endDate: addDays(cycle1Start, 27),
    lengthDays: 28,
    ovulationDetected: true,
    ovulationDate: addDays(cycle1Start, 14),
    ovulationConfidence: 92,
    baselineTemperature: 36.3,
    lutealTemperature: 36.7,
    lutealPhaseDays: 14,
    fertileWindowStart: addDays(cycle1Start, 9),
    fertileWindowEnd: addDays(cycle1Start, 15)
  });

  // Cycle 2: Current (Day 17)
  const cycle2Start = addDays(cycle1Start, 28);
  for (let i = 0; i < 17; i++) {
    const date = addDays(cycle2Start, i);
    let temp = 36.3 + (Math.random() * 0.1);
    if (i > 13) temp += 0.4;
    
    temperatures.push({
      id: `t2-${i}`,
      date,
      temperature: parseFloat(temp.toFixed(2)),
      time: '08:45 AM',
      timestamp: date
    });
  }

  cycles.push({
    id: 'cycle-2',
    startDate: cycle2Start,
    lengthDays: 28,
    ovulationDetected: true,
    ovulationDate: addDays(cycle2Start, 13),
    ovulationConfidence: 88,
    baselineTemperature: 36.3,
    lutealTemperature: 36.7,
    lutealPhaseDays: 14,
    fertileWindowStart: addDays(cycle2Start, 8),
    fertileWindowEnd: addDays(cycle2Start, 14)
  });

  const alerts: HealthAlert[] = [
    {
      id: 'alert-1',
      title: 'Device Synced Successfully',
      message: '17 readings were successfully synced from your Saheli Patch.',
      severity: AlertSeverity.LOW,
      isRead: true,
      date: subDays(now, 1)
    }
  ];

  return { temperatures, cycles, alerts };
}
