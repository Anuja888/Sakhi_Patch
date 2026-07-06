
import { useMemo } from 'react';
import { TemperatureReading, UserProfile, CyclePhase, PCOSResult } from '../types';

export interface CycleAnalysis {
  dayOfCycle: number;
  phase: CyclePhase;
  pcosResult: PCOSResult;
  hasSufficientData: boolean;
  summary: string;
}

export const analyzeCycle = ({
  readings,
  profile,
  now = Date.now(),
}: {
  readings: TemperatureReading[];
  profile: UserProfile;
  now?: number;
}): CycleAnalysis => {
  const dayMs = 24 * 60 * 60 * 1000;
  const dayOfCycle = Math.max(1, Math.floor((now - profile.lastPeriodDate) / dayMs) + 1);

  const sorted = [...readings].sort((a, b) => a.timestamp - b.timestamp);
  const recentWindowSeconds = 3 * 24 * 60 * 60;
  const recent = sorted.filter((reading) => (now / 1000 - reading.timestamp) < recentWindowSeconds);
  const prev = sorted.filter((reading) => {
    const diff = now / 1000 - reading.timestamp;
    return diff >= recentWindowSeconds && diff < 6 * 24 * 60 * 60;
  });
  // Consider data sufficient for phase detection if we have at least one recent and one prior reading,
  // or a small history of readings overall.
  const hasSufficientData = (recent.length >= 1 && prev.length >= 1) || recent.length >= 2 || sorted.length >= 3;

  let phase: CyclePhase = 'follicular';
  if (dayOfCycle <= 5) {
    phase = 'period';
  } else if (hasSufficientData && recent.length > 0 && prev.length > 0) {
    const avgRecent = recent.reduce((sum, item) => sum + item.temperature, 0) / recent.length;
    const avgPrev = prev.reduce((sum, item) => sum + item.temperature, 0) / prev.length;
    if (avgRecent - avgPrev > 0.2) phase = 'luteal';
  } else if (hasSufficientData && dayOfCycle >= 12 && dayOfCycle <= 17) {
    // Only assume fertile window if we have sufficient tracking data
    phase = 'fertile';
  }

  let pcosResult: PCOSResult;
  if (!hasSufficientData) {
    pcosResult = {
      risk: 'medium',
      message: 'Insufficient data to estimate cycle risk yet. Continue tracking for a more reliable assessment.',
    };
  } else if (profile.averageCycleLength < 21 || profile.averageCycleLength > 35) {
    pcosResult = {
      risk: 'high',
      message: 'Multiple indicators suggest an irregular cycle length. Please consult a clinician for guidance.',
    };
  } else {
    pcosResult = {
      risk: 'low',
      message: 'Cycles appear normal based on the current data.',
    };
  }

  const summary = hasSufficientData
    ? `Estimated phase based on ${sorted.length} reading(s).`
    : 'Not enough readings to make a reliable cycle estimate yet.';
  // Debug logging for tests (can be removed later)
  // eslint-disable-next-line no-console
  console.debug('analyzeCycle:', { dayOfCycle, recentCount: recent.length, prevCount: prev.length, hasSufficientData, phase });

  return { dayOfCycle, phase, pcosResult, hasSufficientData, summary };
};

export const useCycleLogic = (readings: TemperatureReading[], profile: UserProfile) => {
  const currentStatus = useMemo(() => analyzeCycle({ readings, profile, now: Date.now() }), [readings, profile]);
  return currentStatus;
};
