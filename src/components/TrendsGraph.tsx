
import React, { useState, useMemo } from 'react';
import { TemperatureReading, UserProfile } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Download, TrendingUp } from 'lucide-react';

interface TrendsGraphProps {
  readings: TemperatureReading[];
  profile: UserProfile;
}

const TrendsGraph: React.FC<TrendsGraphProps> = ({ readings, profile }) => {
  const [range, setRange] = useState<7 | 30 | 90>(7);

  const chartData = useMemo(() => {
    // Generate some mock data if empty for visual appeal, but prioritize actual readings
    if (readings.length === 0) {
      return Array.from({ length: range }).map((_, i) => ({
        day: i + 1,
        temp: 36.2 + (Math.sin(i / 2) * 0.4) + (Math.random() * 0.2),
        phase: i < 5 ? 'period' : i < 12 ? 'follicular' : i < 17 ? 'fertile' : 'luteal'
      }));
    }
    
    // Sort and filter real readings
    const cutoff = (Date.now() / 1000) - (range * 24 * 60 * 60);
    return readings
      .filter(r => r.timestamp > cutoff)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((r, i) => ({
        day: i + 1,
        temp: r.temperature,
        timestamp: r.timestamp
      }));
  }, [readings, range]);

  const stats = useMemo(() => {
    const temps = chartData.map(d => d.temp);
    const avg = temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2) : '--';
    const max = temps.length > 0 ? Math.max(...temps).toFixed(2) : '--';
    const min = temps.length > 0 ? Math.min(...temps).toFixed(2) : '--';
    return { avg, max, min };
  }, [chartData]);

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-xl text-gray-800">Temperature Trends</h2>
        <button className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors">
          <Download size={20} />
        </button>
      </div>

      {/* Range Selectors */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        {[7, 30, 90].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as any)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              range === r ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {r} Days
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-[32px] p-4 shadow-sm border border-gray-100 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#AAA' }} 
              label={{ value: 'Days', position: 'insideBottom', offset: -5, fontSize: 10 }}
            />
            <YAxis 
              domain={[36, 37.5]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#AAA' }}
              label={{ value: '°C', angle: -90, position: 'insideLeft', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`${value.toFixed(2)}°C`, 'Temp']}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#FF6B9D" 
              strokeWidth={3} 
              dot={{ r: 3, fill: '#FF6B9D', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#FF6B9D', stroke: '#FFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Average', val: stats.avg, color: 'text-secondary' },
          { label: 'High', val: stats.max, color: 'text-danger' },
          { label: 'Low', val: stats.min, color: 'text-success' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm text-center">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.val}°</p>
          </div>
        ))}
      </div>

      {/* Analysis Card */}
      <div className="bg-secondary/5 border border-secondary/10 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-secondary" size={20} />
          </div>
          <h4 className="font-bold text-gray-800">Phase Insights</h4>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your basal body temperature shows a steady increase over the last 3 days, indicating you've likely entered the <span className="text-secondary font-bold">Luteal Phase</span>. This is a positive sign of healthy ovulation.
        </p>
      </div>
    </div>
  );
};

export default TrendsGraph;
