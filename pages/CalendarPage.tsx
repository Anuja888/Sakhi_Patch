
import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { Cycle, TemperatureReading, CyclePhase } from '../types';
import { AlgorithmService } from '../services/algorithmService';
import { COLORS } from '../constants';

interface Props {
  cycles: Cycle[];
  temperatures: TemperatureReading[];
}

export const CalendarPage: React.FC<Props> = ({ cycles, temperatures }) => {
  const currentMonth = new Date();
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getDayInfo = (date: Date) => {
    const cycle = cycles.find(c => date >= c.startDate && (!c.endDate || date <= c.endDate));
    const hasTemp = temperatures.some(t => isSameDay(t.date, date));
    let phase = CyclePhase.UNKNOWN;
    if (cycle) {
      phase = AlgorithmService.getPhaseForDate(cycle, date);
    }
    return { phase, hasTemp, cycle };
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="px-6 py-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Cycle Calendar</h1>
        <div className="flex gap-4 items-center text-gray-400">
          <ChevronLeft size={20} />
          <span className="font-bold text-gray-800 text-sm uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</span>
          <ChevronRight size={20} />
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-7 mb-6">
          {dayNames.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-300 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-6">
          {/* Offset for first day */}
          {Array.from({ length: getDay(days[0]) }).map((_, i) => (
            <div key={`offset-${i}`}></div>
          ))}
          {days.map(day => {
            const { phase, hasTemp } = getDayInfo(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div key={day.toISOString()} className="relative flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isToday ? 'ring-2 ring-pink-500 ring-offset-2' : ''
                  }`}
                  style={{ 
                    backgroundColor: phase !== CyclePhase.UNKNOWN ? `${COLORS.phases[phase]}15` : 'transparent',
                    color: phase !== CyclePhase.UNKNOWN ? COLORS.phases[phase] : COLORS.text,
                    border: phase !== CyclePhase.UNKNOWN ? `1px solid ${COLORS.phases[phase]}30` : 'none'
                  }}
                >
                  {format(day, 'd')}
                </div>
                {hasTemp && (
                  <div className="absolute -bottom-1 text-pink-500">
                    <Star size={8} fill="currentColor" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 space-y-4 border border-gray-50">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider opacity-50">Phase Legend</h3>
        <div className="grid grid-cols-2 gap-4">
          <LegendItem color={COLORS.phases.MENSTRUATION} label="Menstruation" />
          <LegendItem color={COLORS.phases.FOLLICULAR} label="Follicular" />
          <LegendItem color={COLORS.phases.OVULATION} label="Ovulation" />
          <LegendItem color={COLORS.phases.LUTEAL} label="Luteal" />
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
    <span className="text-xs font-semibold text-gray-600">{label}</span>
  </div>
);
