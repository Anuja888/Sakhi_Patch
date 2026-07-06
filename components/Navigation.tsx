
import React from 'react';
import { Home, BarChart2, Calendar, Bell } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'graph', icon: BarChart2, label: 'Graph' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-pink-600' : 'text-gray-400'
            }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium uppercase">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
