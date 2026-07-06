
import React from 'react';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import { TemperatureChart } from '../components/TemperatureChart';
import { TemperatureReading, Cycle } from '../types';
import { format } from 'date-fns';

interface Props {
  temperatures: TemperatureReading[];
  cycles: Cycle[];
}

export const GraphPage: React.FC<Props> = ({ temperatures, cycles }) => {
  const currentCycle = cycles[cycles.length - 1];

  return (
    <div className="px-6 py-8 space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-xl shadow-sm"><ArrowLeft size={20} /></div>
          <h1 className="text-xl font-bold text-gray-900">Temperature Log</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-xl shadow-sm text-gray-400"><Filter size={20} /></button>
          <button className="p-2 bg-white rounded-xl shadow-sm text-gray-400"><Download size={20} /></button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex gap-4 mb-8">
          <button className="px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-semibold">Current Cycle</button>
          <button className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-sm font-semibold">Last 3 Months</button>
        </div>
        
        <TemperatureChart 
          data={temperatures} 
          baseline={currentCycle?.baselineTemperature}
          ovulationDate={currentCycle?.ovulationDate}
          height={320}
        />
        
        <div className="mt-8 flex justify-around p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Avg Temp</p>
            <p className="text-lg font-bold text-gray-800">36.4°C</p>
          </div>
          <div className="w-[1px] bg-gray-200 h-8 self-center"></div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Baseline</p>
            <p className="text-lg font-bold text-gray-800">36.3°C</p>
          </div>
          <div className="w-[1px] bg-gray-200 h-8 self-center"></div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Luteal Rise</p>
            <p className="text-lg font-bold text-green-500">+0.4°C</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 px-2">Recent Readings</h3>
        <div className="space-y-3">
          {temperatures.slice(-5).reverse().map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-50 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                  <span className="font-bold text-xs">{format(t.date, 'd')}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{format(t.date, 'MMMM do')}</p>
                  <p className="text-xs text-gray-400">{t.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{t.temperature}°C</p>
                <p className="text-[10px] text-green-500 font-bold uppercase">Stable</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
