
import React from 'react';
import { TemperatureReading, UserProfile, DeviceInfo } from '../types';
import { useCycleLogic } from '../hooks/useCycleLogic';
import { Thermometer, Zap, AlertCircle, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DashboardProps {
  readings: TemperatureReading[];
  profile: UserProfile;
  device: DeviceInfo | null;
}

const Dashboard: React.FC<DashboardProps> = ({ readings, profile, device }) => {
  const { dayOfCycle, phase, pcosResult } = useCycleLogic(readings, profile);
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;

  const phaseColors = {
    period: 'bg-danger/10 text-danger border-danger/20',
    follicular: 'bg-secondary/10 text-secondary border-secondary/20',
    fertile: 'bg-success/10 text-success border-success/20',
    luteal: 'bg-warning/10 text-warning border-warning/20',
  };

  const phaseLabels = {
    period: 'Period Phase',
    follicular: 'Follicular Phase',
    fertile: 'Fertile Window',
    luteal: 'Luteal Phase',
  };

  return (
    <div className="space-y-6">
      {/* Device Status Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${device ? 'bg-success animate-pulse' : 'bg-gray-300'}`} />
            <span className="font-semibold text-gray-700">
              {device ? device.name : 'No Device Connected'}
            </span>
          </div>
          {device && (
            <div className="flex items-center gap-1 text-secondary">
              <Zap size={16} fill="currentColor" />
              <span className="text-sm font-bold">{device.batteryPercent}%</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {device ? `Last sync: 2 min ago` : 'Connect your SakhiPatch to start tracking'}
        </p>
      </div>

      {/* Main Temperature Display */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Thermometer className="text-primary" size={32} />
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">Today's Temperature</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-6xl font-heading font-bold text-[#333]">
            {latestReading ? latestReading.temperature.toFixed(1) : '--.-'}
          </span>
          <span className="text-2xl font-bold text-gray-400">°C</span>
        </div>
        <div className="w-full mt-6 flex items-center gap-2">
          <span className="text-xs text-gray-400">36.0°C</span>
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-primary" 
              style={{ width: latestReading ? `${((latestReading.temperature - 36) / 1.5) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-xs text-gray-400">37.5°C</span>
        </div>
      </div>

      {/* Cycle Tracking Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-primary mb-2">
            <CalendarIcon size={18} />
            <span className="text-sm font-semibold">Cycle Day</span>
          </div>
          <p className="text-2xl font-bold text-[#333]">Day {dayOfCycle}</p>
          <p className="text-xs text-gray-500 mt-1">of {profile.averageCycleLength} days</p>
        </div>
        <div className={`rounded-3xl p-5 border shadow-sm ${phaseColors[phase]}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full bg-current`} />
            <span className="text-sm font-semibold">{phaseLabels[phase]}</span>
          </div>
          <p className="text-lg font-bold">
            {phase === 'fertile' ? 'High Fertility' : 'Normal'}
          </p>
          <button className="text-[10px] uppercase tracking-wider font-bold mt-2 flex items-center">
            Details <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* PCOS Risk Card */}
      <div className={`rounded-3xl p-6 border shadow-sm ${
        pcosResult.risk === 'low' ? 'bg-white border-gray-100' : 'bg-warning/5 border-warning/20'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className={pcosResult.risk === 'high' ? 'text-danger' : 'text-warning'} size={20} />
            <h4 className="font-bold text-gray-800">PCOS Risk Assessment</h4>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            pcosResult.risk === 'low' ? 'bg-success/10 text-success' : 
            pcosResult.risk === 'medium' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
          }`}>
            {pcosResult.risk} Risk
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {pcosResult.message}
        </p>
        <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-colors flex items-center justify-center gap-2">
          View Detailed Analysis <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
