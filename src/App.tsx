
import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { UserProfile, TemperatureReading, DeviceInfo } from './types';
import Dashboard from './components/Dashboard';
import TrendsGraph from './components/TrendsGraph';
import CalendarView from './components/CalendarView';
import ConnectView from './components/ConnectView';
import SettingsView from './components/SettingsView';
import Navbar from './components/Navbar';
import Header from './components/Header';
import LoginView from './components/LoginView';

const AUTH_KEY = 'saheli_auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'graph' | 'calendar' | 'connect' | 'settings'>('home');
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'demo' | 'signed-in' | null>(null);

  useEffect(() => {
    const savedAuth = window.localStorage.getItem(AUTH_KEY);
    const isCareTeam = window.localStorage.getItem('saheli_care_team') === 'true';
    
    if (savedAuth === 'demo' || savedAuth === 'signed-in') {
      setAuthMode(savedAuth as 'demo' | 'signed-in');
      setIsAuthenticated(true);
      
      if (savedAuth === 'demo') {
        const seeded = storageService.seedDemoData();
        setReadings(seeded.readings);
        setProfile(seeded.profile);
        setDevice(seeded.device);
      } else if (isCareTeam) {
        setProfile({
          name: 'Care Team User',
          age: 32,
          averageCycleLength: 30,
          lastPeriodDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
          language: 'en',
        });
        setReadings([
          { id: 'care-1', timestamp: Date.now() / 1000 - 5 * 24 * 60 * 60, temperature: 36.4, battery_voltage: 3.7, device_id: 'care-device' },
          { id: 'care-2', timestamp: Date.now() / 1000 - 3 * 24 * 60 * 60, temperature: 36.6, battery_voltage: 3.7, device_id: 'care-device' },
          { id: 'care-3', timestamp: Date.now() / 1000 - 1 * 24 * 60 * 60, temperature: 36.8, battery_voltage: 3.8, device_id: 'care-device' },
        ]);
        setDevice({
          deviceId: 'care-device',
          name: 'SakhiPatch Care',
          batteryPercent: 88,
          firmwareVersion: 'v1.0.2',
          lastConnected: Date.now(),
        });
      } else {
        setProfile(storageService.getProfile());
        setReadings(storageService.getReadings());
        setDevice(storageService.getDeviceInfo());
      }
    }
  }, []);

  const handleNewReading = (reading: TemperatureReading) => {
    storageService.addReading(reading);
    setReadings(prev => [...prev, reading]);
  };

  const handleExportData = () => {
    const rows = [
      ['timestamp', 'temperature', 'battery_voltage', 'device_id'],
      ...readings.map((reading) => [reading.timestamp, reading.temperature, reading.battery_voltage, reading.device_id]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'saheli-patch-data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteData = () => {
    if (!window.confirm('Delete all local data and reset the app?')) return;
    storageService.clearAllData();
    setReadings([]);
    setProfile(storageService.getDefaultProfile());
    setDevice(null);
  };

  const handleLogin = (email: string, password: string) => {
    window.localStorage.setItem(AUTH_KEY, 'signed-in');
    setAuthMode('signed-in');
    setIsAuthenticated(true);
    
    if (email.includes('care')) {
      window.localStorage.setItem('saheli_care_team', 'true');
      setProfile({
        name: 'Care Team User',
        age: 32,
        averageCycleLength: 30,
        lastPeriodDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
        language: 'en',
      });
      setReadings([
        { id: 'care-1', timestamp: Date.now() / 1000 - 5 * 24 * 60 * 60, temperature: 36.4, battery_voltage: 3.7, device_id: 'care-device' },
        { id: 'care-2', timestamp: Date.now() / 1000 - 3 * 24 * 60 * 60, temperature: 36.6, battery_voltage: 3.7, device_id: 'care-device' },
        { id: 'care-3', timestamp: Date.now() / 1000 - 1 * 24 * 60 * 60, temperature: 36.8, battery_voltage: 3.8, device_id: 'care-device' },
      ]);
      setDevice({
        deviceId: 'care-device',
        name: 'SakhiPatch Care',
        batteryPercent: 88,
        firmwareVersion: 'v1.0.2',
        lastConnected: Date.now(),
      });
    } else {
      const savedProfile = storageService.getProfile();
      let userProfile = savedProfile;
      if (savedProfile.name === 'User' || savedProfile.name === 'Demo User') {
        const nameFromEmail = email.split('@')[0];
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        userProfile = {
          ...savedProfile,
          name: formattedName,
        };
        storageService.saveProfile(userProfile);
      }
      setProfile(userProfile);
      setReadings(storageService.getReadings());
      setDevice(storageService.getDeviceInfo());
    }
  };

  const handleDemo = () => {
    window.localStorage.removeItem('saheli_care_team');
    window.localStorage.setItem(AUTH_KEY, 'demo');
    setAuthMode('demo');
    setIsAuthenticated(true);
    const seeded = storageService.seedDemoData();
    setReadings(seeded.readings);
    setProfile(seeded.profile);
    setDevice(seeded.device);
  };

  const handleSignup = (
    name: string,
    age: number,
    averageCycleLength: number,
    lastPeriodDate: number,
    language: 'en' | 'hi' | 'te'
  ) => {
    window.localStorage.setItem(AUTH_KEY, 'signed-in');
    setAuthMode('signed-in');
    setIsAuthenticated(true);
    const newProfile = {
      name,
      age,
      averageCycleLength,
      lastPeriodDate,
      language,
    };
    storageService.saveProfile(newProfile);
    storageService.saveReadings([]);
    storageService.saveDeviceInfo(null);
    setProfile(newProfile);
    setReadings([]);
    setDevice(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setAuthMode(null);
    setProfile(null);
    setReadings([]);
    setDevice(null);
  };

  const renderContent = () => {
    if (!profile) return null;
    switch (activeTab) {
      case 'home':
        return <Dashboard readings={readings} profile={profile} device={device} />;
      case 'graph':
        return <TrendsGraph readings={readings} profile={profile} />;
      case 'calendar':
        return <CalendarView readings={readings} profile={profile} />;
      case 'connect':
        return <ConnectView onDeviceConnected={setDevice} onNewReading={handleNewReading} />;
      case 'settings':
        return <SettingsView profile={profile} onProfileUpdate={(p) => { setProfile(p); storageService.saveProfile(p); }} device={device} onDisconnect={() => setDevice(null)} onExportData={handleExportData} onDeleteData={handleDeleteData} />;
      default:
        return <Dashboard readings={readings} profile={profile} device={device} />;
    }
  };

  if (!isAuthenticated || !profile) {
    return <LoginView onLogin={handleLogin} onDemo={handleDemo} onSignup={handleSignup} />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff8fb_0%,#f7fffd_100%)]">
      <Header onLogout={handleLogout} />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 pb-28 lg:flex-row lg:px-6 lg:py-6 lg:pb-6">
        <aside className="lg:w-72 lg:flex-shrink-0">
          <div className="rounded-[28px] border border-gray-200/80 bg-white/90 p-3 shadow-sm backdrop-blur">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto rounded-[28px] border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
