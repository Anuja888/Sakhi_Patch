
import React, { useState } from 'react';
import { TemperatureReading, UserProfile } from '../types';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

interface CalendarViewProps {
  readings: TemperatureReading[];
  profile: UserProfile;
}

const CalendarView: React.FC<CalendarViewProps> = ({ readings, profile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Helper to determine day type (simulated logic)
  const getDayType = (day: number) => {
    const cycleDay = (day % 28) || 28;
    if (cycleDay <= 5) return 'period';
    if (cycleDay >= 12 && cycleDay <= 17) return 'fertile';
    if (cycleDay > 17) return 'luteal';
    return 'follicular';
  };

  const typeStyles = {
    period: 'bg-danger/20 text-danger border-danger/10',
    fertile: 'bg-success/20 text-success border-success/10',
    luteal: 'bg-warning/20 text-warning border-warning/10',
    follicular: 'bg-secondary/10 text-secondary border-secondary/10',
    none: 'bg-white text-gray-400 border-transparent',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
          <ChevronLeft size={24} />
        </button>
        <h3 className="font-heading font-bold text-lg text-gray-800">{monthName} {year}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">{day}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth(year, currentDate.getMonth()) }).map((_, i) => {
            const day = i + 1;
            const type = getDayType(day);
            return (
              <button
                key={day}
                className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-bold border transition-all hover:scale-105 active:scale-95 ${typeStyles[type]}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 mt-6 border-t border-gray-50 pt-6">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-gray-500 font-medium">Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-gray-500 font-medium">Fertile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-gray-500 font-medium">Luteal</span>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-transform active:scale-95">
        <PlusCircle size={20} />
        Log Period Manually
      </button>

      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 mb-2">Upcoming Prediction</h4>
        <p className="text-sm text-gray-500">
          Your next period is predicted to start on <span className="text-danger font-bold">March 5th</span>. Based on your history, your fertile window will likely be from <span className="text-success font-bold">March 16th to 21st</span>.
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
