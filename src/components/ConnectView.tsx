
import React, { useState, useEffect } from 'react';
import { Bluetooth, RefreshCw, Smartphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { BLEService } from '../services/bleService';
import { DeviceInfo, TemperatureReading } from '../types';
import { storageService } from '../services/storageService';

interface ConnectViewProps {
  onDeviceConnected: (device: DeviceInfo) => void;
  onNewReading: (reading: TemperatureReading) => void;
}

const ConnectView: React.FC<ConnectViewProps> = ({ onDeviceConnected, onNewReading }) => {
  const [scanning, setScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const bleService = BLEService.getInstance();

  const handleScan = async () => {
    try {
      setScanning(true);
      setStatus('scanning');
      setErrorMessage('');
      
      // In a real web app, we call the requestDevice
      const device = await bleService.scanAndConnect();
      
      setStatus('connecting');
      const deviceInfo: DeviceInfo = {
        deviceId: device.id,
        name: device.name || 'SakhiPatch',
        batteryPercent: 85,
        firmwareVersion: 'v1.0.2',
        lastConnected: Date.now()
      };
      
      storageService.saveDeviceInfo(deviceInfo);
      onDeviceConnected(deviceInfo);
      
      // Start receiving data
      await bleService.startNotifications((reading) => {
        onNewReading(reading);
      });

      setStatus('connected');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Bluetooth connection failed');
      setStatus('error');
    } finally {
      setScanning(false);
    }
  };

  const simulateConnection = () => {
    setStatus('connecting');
    setTimeout(() => {
      const mockDevice: DeviceInfo = {
        deviceId: 'demo-device',
        name: 'SakhiPatch Demo',
        batteryPercent: 92,
        firmwareVersion: 'v1.0.0',
        lastConnected: Date.now()
      };
      storageService.seedDemoData();
      storageService.saveDeviceInfo(mockDevice);
      onDeviceConnected(mockDevice);
      
      // Populate the app with demo readings immediately
      const seeded = storageService.seedDemoData();
      seeded.readings.forEach((reading) => onNewReading(reading));
      
      setStatus('connected');
    }, 1000);
  };

  return (
    <div className="space-y-8 flex flex-col items-center py-8">
      <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
        status === 'connected' ? 'bg-success/10 text-success' : 
        status === 'error' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'
      }`}>
        {status === 'connected' ? <CheckCircle2 size={64} /> : 
         status === 'error' ? <AlertCircle size={64} /> :
         <Bluetooth size={64} className={scanning ? 'animate-bounce' : ''} />}
      </div>

      <div className="text-center px-4">
        <h2 className="font-heading font-bold text-2xl text-gray-800 mb-2">
          {status === 'idle' && 'Connect Saheli Patch'}
          {status === 'scanning' && 'Scanning for Devices...'}
          {status === 'connecting' && 'Pairing with Patch...'}
          {status === 'connected' && 'Successfully Paired!'}
          {status === 'error' && 'Connection Failed'}
        </h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          {status === 'idle' && 'Turn on your Saheli Patch and place it near your phone to begin syncing data.'}
          {status === 'error' && errorMessage}
          {status === 'connected' && 'Your device is now connected and tracking. Data will sync automatically.'}
        </p>
      </div>

      <div className="w-full space-y-4">
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-700">How demo mode works</p>
          <p className="mt-1">If no patch is connected, the app can generate sample temperature readings so you can explore the dashboard, trends, and cycle insights instantly.</p>
        </div>

        {status !== 'connected' && (
          <button
            onClick={handleScan}
            disabled={scanning}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
          >
            {scanning ? <RefreshCw className="animate-spin" size={20} /> : <Bluetooth size={20} />}
            {scanning ? 'Searching...' : 'Scan for Devices'}
          </button>
        )}

        {status === 'idle' || status === 'error' ? (
          <button
            onClick={simulateConnection}
            className="w-full py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50"
          >
            <Smartphone size={20} />
            Try Demo Mode
          </button>
        ) : null}
      </div>

      {status === 'connected' && (
        <div className="bg-success/5 border border-success/10 rounded-3xl p-6 w-full text-center">
          <p className="text-sm text-success font-medium mb-4">Device: SakhiPatch_Demo</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary font-bold text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-2xl p-4 w-full">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Troubleshooting</h4>
        <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
          <li>Ensure Bluetooth is enabled on your phone.</li>
          <li>Make sure the patch is charged (light should be green).</li>
          <li>Keep the patch within 5 meters of your phone.</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectView;
