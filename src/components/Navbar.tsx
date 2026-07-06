
import React from 'react';
import { Home, BarChart2, Calendar, Bluetooth, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'graph', icon: BarChart2, label: 'Trends' },
    { id: 'calendar', icon: Calendar, label: 'Cycle' },
    { id: 'connect', icon: Bluetooth, label: 'Patch' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-2 py-3 backdrop-blur lg:static lg:bottom-auto lg:left-auto lg:right-auto lg:rounded-[24px] lg:border lg:border-gray-200 lg:bg-white lg:p-3 lg:shadow-sm">
      <ul className="flex items-center justify-around lg:flex-col lg:items-stretch lg:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id} className="flex-1 lg:flex-none">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full flex-col items-center justify-center rounded-2xl px-3 py-3 transition-all lg:flex-row lg:justify-start lg:gap-3 ${
                  isActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[11px] font-semibold lg:text-sm ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
