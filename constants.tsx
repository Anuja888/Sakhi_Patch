
import React from 'react';
import { CyclePhase, AlertSeverity } from './types';

export const COLORS = {
  primary: '#ec4899',
  secondary: '#f472b6',
  dark: '#be185d',
  bg: '#fafafa',
  card: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  phases: {
    [CyclePhase.MENSTRUATION]: '#ef4444',
    [CyclePhase.FOLLICULAR]: '#3b82f6',
    [CyclePhase.OVULATION]: '#22c55e',
    [CyclePhase.LUTEAL]: '#a855f7',
    [CyclePhase.UNKNOWN]: '#94a3b8',
  },
  alerts: {
    [AlertSeverity.LOW]: '#3b82f6',
    [AlertSeverity.MEDIUM]: '#f59e0b',
    [AlertSeverity.HIGH]: '#ef4444',
    [AlertSeverity.CRITICAL]: '#991b1b',
  }
};

export const DEVICE_CONFIG = {
  IP: '192.168.4.1',
  BASE_URL: 'http://192.168.4.1',
  SSID: 'Saheli-Patch',
};
