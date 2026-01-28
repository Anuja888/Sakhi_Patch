
import React, { useState } from 'react';
import { Thermometer, Calendar, Activity, RefreshCw, Plus, ChevronRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { UserProfile, TemperatureReading, Cycle, HealthAlert, CyclePhase } from '../types';
import { TemperatureChart } from '../components/TemperatureChart';
import { AlgorithmService } from '../services/algorithmService';
import { DeviceService } from '../services/deviceService';
import { COLORS } from '../constants';

interface Props {
  profile: UserProfile;
  temperatures: TemperatureReading[];
  cycles: Cycle[];
  alerts: HealthAlert[];
  onUpdateTemperatures: (t: TemperatureReading[]) => void;
  onUpdateCycles: (c: Cycle[]) => void;
  onUpdateAlerts: (a: HealthAlert[]) => void;
}

export const HomePage: React.FC<Props> = ({ profile, temperatures, cycles, alerts, onUpdateTemperatures, onUpdateCycles, onUpdateAlerts }) => {
  const [syncing, setSyncing] = useState(false);
  const currentCycle = cycles[cycles.length - 1];
  const latestTemp = temperatures[temperatures.length - 1];
  
  const cycleDay = currentCycle 
    ? differenceInDays(new Date(), currentCycle.startDate) + 1 
    : 0;
  
  const currentPhase = currentCycle 
    ? AlgorithmService.getPhaseForDate(currentCycle, new Date()) 
    : CyclePhase.UNKNOWN;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const isConnected = await DeviceService.checkConnection();
      if (!isConnected) {
        alert("Saheli Patch device not found. Please connect to 'Saheli-Patch' WiFi network.");
        return;
      }
      const newReadings = await DeviceService.syncData();
      if (newReadings.length > 0) {
        const updatedTemps = [...temperatures, ...newReadings].sort((a,b) => a.date.getTime() - b.date.getTime());
        onUpdateTemperatures(updatedTemps);
        
        // Run algorithm
        const update = AlgorithmService.detectOvulation(updatedTemps, currentCycle);
        if (update) {
          const updatedCycles = cycles.map(c => c.id === currentCycle.id ? { ...c, ...update } : c);
          onUpdateCycles(updatedCycles);
        }
        
        await DeviceService.clearDeviceData();
        alert(`Synced ${newReadings.length} readings!`);
      }
    } catch (e) {
      alert("Failed to sync device data. Ensure you are connected to the Patch WiFi.");
    } finally {
      setSyncing(false);
    }
  };

  const phaseNames = {
    [CyclePhase.MENSTRUATION]: 'Menstruation',
    [CyclePhase.FOLLICULAR]: 'Follicular Phase',
    [CyclePhase.OVULATION]: 'Ovulation',
    [CyclePhase.LUTEAL]: 'Luteal Phase',
    [CyclePhase.UNKNOWN]: 'Unknown'
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {profile.name || 'Saheli'}</h1>
          <p className="text-gray-500 text-sm">{format(new Date(), 'EEEE, MMMM do')}</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          className="p-3 bg-white rounded-full shadow-md text-pink-500 hover:bg-pink-50 transition-all disabled:opacity-50"
        >
          <RefreshCw size={24} className={syncing ? 'animate-spin' : ''} />
        </button>
      </header>

      {/* Main Status Card */}
      <div className="pink-gradient rounded-[2rem] p-8 text-white shadow-2xl shadow-pink-200">
        <h2 className="text-lg font-semibold opacity-90 mb-6">Current Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="mx-auto w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Thermometer size={20} />
            </div>
            <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Temp</p>
            <p className="text-xl font-bold">{latestTemp ? `${latestTemp.temperature}°C` : '--'}</p>
          </div>
          <div className="text-center space-y-1">
            <div className="mx-auto w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Day</p>
            <p className="text-xl font-bold">{cycleDay > 0 ? cycleDay : '--'}</p>
          </div>
          <div className="text-center space-y-1">
            <div className="mx-auto w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity size={20} />
            </div>
            <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Phase</p>
            <p className="text-xs font-bold leading-tight line-clamp-2">{phaseNames[currentPhase]}</p>
          </div>
        </div>
      </div>

      {/* Temp Chart Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Temperature Trend</h3>
          <span className="text-xs text-gray-400 font-medium">Last 7 readings</span>
        </div>
        <TemperatureChart 
          data={temperatures.slice(-7)} 
          baseline={currentCycle?.baselineTemperature} 
          ovulationDate={currentCycle?.ovulationDate}
          height={180}
        />
      </div>

      {/* Alerts Preview */}
      {alerts.some(a => !a.isRead) && (
        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex gap-4 items-center">
          <div className="bg-orange-200 p-2 rounded-xl text-orange-600">
            <Activity size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-orange-800 text-sm">Health Insight</h4>
            <p className="text-xs text-orange-700 line-clamp-1">{alerts.find(a => !a.isRead)?.title}</p>
          </div>
          <ChevronRight size={20} className="text-orange-400" />
        </div>
      )}

      {/* Action Button */}
      <button className="w-full bg-white border-2 border-dashed border-gray-200 py-5 rounded-2xl flex items-center justify-center gap-3 text-gray-400 hover:border-pink-300 hover:text-pink-500 transition-all">
        <Plus size={20} />
        <span className="font-semibold">Add Log Manually</span>
      </button>
    </div>
  );
};
