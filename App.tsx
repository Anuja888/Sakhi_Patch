
import React, { useState, useEffect } from 'react';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { GraphPage } from './pages/GraphPage';
import { CalendarPage } from './pages/CalendarPage';
import { AlertsPage } from './pages/AlertsPage';
import { BottomNav } from './components/Navigation';
import { StorageService } from './services/storageService';
import { UserProfile, TemperatureReading, Cycle, HealthAlert } from './types';
import { generateDemoData } from './utils/demoData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [temperatures, setTemperatures] = useState<TemperatureReading[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = StorageService.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setTemperatures(StorageService.getTemperatures());
      setCycles(StorageService.getCycles());
      setAlerts(StorageService.getAlerts());
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  const handleTryDemo = () => {
    const demo = generateDemoData();
    const demoProfile: UserProfile = {
      name: 'Demo User',
      lastPeriodStart: demo.cycles[demo.cycles.length - 1].startDate,
      avgCycleLength: 28,
      hasDevice: true,
      onboardingComplete: true
    };
    
    setProfile(demoProfile);
    setTemperatures(demo.temperatures);
    setCycles(demo.cycles);
    setAlerts(demo.alerts);
    
    StorageService.saveProfile(demoProfile);
    StorageService.saveTemperatures(demo.temperatures);
    StorageService.saveCycles(demo.cycles);
    StorageService.saveAlerts(demo.alerts);
    StorageService.setDemoMode(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-pink-500 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-pink-200 rounded"></div>
      </div>
    </div>
  );

  if (!profile || !profile.onboardingComplete) {
    return <OnboardingPage onComplete={handleOnboardingComplete} onDemo={handleTryDemo} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {activeTab === 'home' && (
        <HomePage 
          profile={profile} 
          temperatures={temperatures} 
          cycles={cycles} 
          alerts={alerts}
          onUpdateTemperatures={(t) => { setTemperatures(t); StorageService.saveTemperatures(t); }}
          onUpdateCycles={(c) => { setCycles(c); StorageService.saveCycles(c); }}
          onUpdateAlerts={(a) => { setAlerts(a); StorageService.saveAlerts(a); }}
        />
      )}
      {activeTab === 'graph' && (
        <GraphPage temperatures={temperatures} cycles={cycles} />
      )}
      {activeTab === 'calendar' && (
        <CalendarPage cycles={cycles} temperatures={temperatures} />
      )}
      {activeTab === 'alerts' && (
        <AlertsPage 
          alerts={alerts} 
          onUpdateAlerts={(a) => { setAlerts(a); StorageService.saveAlerts(a); }} 
        />
      )}
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
