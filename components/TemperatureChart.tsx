
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot
} from 'recharts';
import { format, isSameDay } from 'date-fns';
import { TemperatureReading } from '../types';
import { COLORS } from '../constants';

interface Props {
  data: TemperatureReading[];
  baseline?: number;
  ovulationDate?: Date;
  height?: number;
}

export const TemperatureChart: React.FC<Props> = ({ data, baseline = 36.3, ovulationDate, height = 300 }) => {
  const chartData = data.map(r => ({
    date: format(r.date, 'MMM d'),
    temp: r.temperature,
    isOvulation: ovulationDate ? isSameDay(r.date, ovulationDate) : false,
    fullDate: r.date
  }));

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isOvulation) {
      return (
        <svg x={cx - 10} y={cy - 10} width={20} height={20} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill={COLORS.phases.OVULATION} stroke="#fff" strokeWidth="2" />
        </svg>
      );
    }
    return <Dot {...props} r={4} fill={COLORS.primary} strokeWidth={2} stroke="#fff" />;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            dy={10}
          />
          <YAxis 
            domain={[35.8, 37.5]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: COLORS.text }}
          />
          {baseline && (
            <ReferenceLine y={baseline} stroke="#cbd5e1" strokeDasharray="4 4" label={{ position: 'right', value: 'Baseline', fill: '#94a3b8', fontSize: 10 }} />
          )}
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke={COLORS.primary} 
            strokeWidth={3} 
            dot={<CustomDot />}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
