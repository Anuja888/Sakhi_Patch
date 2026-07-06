import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Platform } from 'react-native';
import { storageService } from './services/storageServiceNative';
import { UserProfile, TemperatureReading, DeviceInfo } from './types';
import Dashboard from './components/native/DashboardNative';
import TrendsGraph from './components/native/TrendsGraphNative';
import CalendarView from './components/native/CalendarViewNative';
import ConnectView from './components/native/ConnectViewNative';
import SettingsView from './components/native/SettingsViewNative';
import Navbar from './components/native/NavbarNative';
import Header from './components/native/HeaderNative';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'graph' | 'calendar' | 'connect' | 'settings'>('home');
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [profile, setProfile] = useState<UserProfile>(null as unknown as UserProfile);
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedReadings, loadedProfile, loadedDevice] = await Promise.all([
          storageService.getReadings(),
          storageService.getProfileAsync(),
          storageService.getDeviceInfo(),
        ]);
        setReadings(loadedReadings);
        setProfile(loadedProfile);
        setDevice(loadedDevice);
      } catch (error) {
        console.error('Error loading data:', error);
        setProfile(storageService.getDefaultProfile());
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNewReading = async (reading: TemperatureReading) => {
    try {
      await storageService.addReading(reading);
      setReadings(prev => [...prev, reading]);
    } catch (error) {
      console.error('Error adding reading:', error);
    }
  };

  const handleProfileUpdate = async (p: UserProfile) => {
    try {
      await storageService.saveProfile(p);
      setProfile(p);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderContent = () => {
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
        return <SettingsView profile={profile} onProfileUpdate={handleProfileUpdate} device={device} onDisconnect={() => setDevice(null)} />;
      default:
        return <Dashboard readings={readings} profile={profile} device={device} />;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Header />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <Header />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        {renderContent()}
      </ScrollView>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

export default App;
