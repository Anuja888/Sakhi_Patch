
import React from 'react';
import { UserProfile, DeviceInfo } from '../types';
import { User, Languages, Bell, Database, Info, LogOut, ChevronRight, Download, Trash2 } from 'lucide-react';
import { LANGUAGES } from '../constants';

interface SettingsViewProps {
  profile: UserProfile;
  onProfileUpdate: (p: UserProfile) => void;
  device: DeviceInfo | null;
  onDisconnect: () => void;
  onExportData: () => void;
  onDeleteData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onProfileUpdate, device, onDisconnect, onExportData, onDeleteData }) => {
  return (
    <div className="space-y-6 pb-6">
      <h2 className="font-heading font-bold text-xl text-gray-800">Settings</h2>

      {/* Profile Section */}
      <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
          <User className="text-primary" size={20} />
          <h3 className="font-bold text-gray-700 text-sm">Account & Profile</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-800">{profile.name}</p>
              <p className="text-xs text-gray-400">{profile.age} years • {profile.averageCycleLength} Day Cycle</p>
            </div>
            <ChevronRight className="text-gray-300" size={18} />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Languages className="text-gray-400" size={18} />
              <span className="text-sm text-gray-600">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">{LANGUAGES[profile.language]}</span>
              <ChevronRight className="text-gray-300" size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Device Section */}
      <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
          <Smartphone className="text-secondary" size={20} />
          <h3 className="font-bold text-gray-700 text-sm">Device Settings</h3>
        </div>
        {device ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Connected Device</span>
              <span className="text-sm font-bold text-gray-800">{device.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Battery Status</span>
              <span className="text-sm font-bold text-success">{device.batteryPercent}%</span>
            </div>
            <button 
              onClick={onDisconnect}
              className="w-full py-3 bg-danger/5 text-danger font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Disconnect Device
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400 mb-4">No device connected</p>
            <button className="text-primary font-bold text-sm">Scan Now</button>
          </div>
        )}
      </section>

      {/* Data Section */}
      <section className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
          <Database className="text-accent" size={20} />
          <h3 className="font-bold text-gray-700 text-sm">Data & Privacy</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button onClick={onExportData} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-gray-600">
            <Download size={18} className="text-gray-400" />
            <span className="text-sm">Export Health Data (CSV)</span>
          </button>
          <button onClick={onDeleteData} className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 text-danger">
            <Trash2 size={18} className="text-danger/50" />
            <span className="text-sm">Delete All Local Data</span>
          </button>
        </div>
      </section>

      <div className="flex flex-col items-center gap-1 opacity-40 py-4">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Saheli Patch v1.0.0</p>
        <p className="text-[10px] text-gray-400">Made with ❤️ for Women's Health</p>
      </div>
    </div>
  );
};

const Smartphone: React.FC<{className?: string, size?: number}> = ({className, size}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
);

export default SettingsView;
