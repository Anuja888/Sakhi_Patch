
import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { HealthAlert, AlertSeverity } from '../types';
import { format } from 'date-fns';

interface Props {
  alerts: HealthAlert[];
  onUpdateAlerts: (a: HealthAlert[]) => void;
}

export const AlertsPage: React.FC<Props> = ({ alerts, onUpdateAlerts }) => {
  const markAsRead = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, isRead: true } : a);
    onUpdateAlerts(updated);
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Health Alerts</h1>
        <div className="bg-white p-2 rounded-xl shadow-sm text-gray-400">
          <Bell size={20} />
        </div>
      </header>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
            <CheckCircle2 size={48} className="opacity-20" />
            <p className="font-medium">No health alerts found.</p>
          </div>
        ) : (
          alerts.slice().reverse().map(alert => (
            <div 
              key={alert.id} 
              className={`p-6 rounded-[2rem] border transition-all ${
                alert.isRead ? 'bg-white border-gray-100 opacity-60' : 'bg-white border-pink-100 shadow-lg shadow-pink-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${
                  alert.severity === AlertSeverity.HIGH ? 'bg-red-50 text-red-500' :
                  alert.severity === AlertSeverity.MEDIUM ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {alert.severity === AlertSeverity.HIGH ? <AlertCircle size={24} /> : <Info size={24} />}
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{format(alert.date, 'MMM d, h:mm a')}</p>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{alert.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{alert.message}</p>
              
              {alert.recommendation && (
                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Recommendation</p>
                  <p className="text-xs text-gray-600 font-medium italic">{alert.recommendation}</p>
                </div>
              )}

              {!alert.isRead && (
                <button 
                  onClick={() => markAsRead(alert.id)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                >
                  Acknowledge
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
