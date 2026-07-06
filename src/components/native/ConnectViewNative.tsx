import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DeviceInfo, TemperatureReading } from '../../types';

interface ConnectViewProps {
  onDeviceConnected: (device: DeviceInfo) => void;
  onNewReading: (reading: TemperatureReading) => void;
}

const ConnectView: React.FC<ConnectViewProps> = ({ onDeviceConnected, onNewReading }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const simulateConnection = () => {
    setStatus('connecting');
    setTimeout(() => {
      const mockDevice: DeviceInfo = {
        deviceId: 'SIM-123',
        name: 'SakhiPatch_Demo',
        batteryPercent: 92,
        firmwareVersion: 'v1.0.0',
        lastConnected: Date.now(),
      };
      onDeviceConnected(mockDevice);

      // Send mock readings
      for (let i = 0; i < 5; i++) {
        onNewReading({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now() / 1000,
          temperature: 36.5 + Math.random() * 0.5,
          battery_voltage: 3.7 + Math.random() * 0.4,
          device_id: 'SIMULATED-001',
        });
      }

      setStatus('connected');
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor:
                status === 'connected'
                  ? 'rgba(76, 175, 80, 0.1)'
                  : status === 'error'
                    ? 'rgba(244, 67, 54, 0.1)'
                    : 'rgba(255, 107, 157, 0.1)',
            },
          ]}
        >
          {status === 'connecting' && (
            <ActivityIndicator size="large" color="#FF6B9D" />
          )}
          {status !== 'connecting' && (
            <Text style={styles.statusEmoji}>
              {status === 'connected'
                ? '✅'
                : status === 'error'
                  ? '❌'
                  : '🔗'}
            </Text>
          )}
        </View>

        <Text style={styles.heading}>
          {status === 'idle' && 'Connect Saheli Patch'}
          {status === 'scanning' && 'Scanning for Devices...'}
          {status === 'connecting' && 'Pairing with Patch...'}
          {status === 'connected' && 'Successfully Paired!'}
          {status === 'error' && 'Connection Failed'}
        </Text>

        <Text style={styles.subtitle}>
          {status === 'idle' &&
            'Turn on your Saheli Patch and place it near your phone to begin syncing data.'}
          {status === 'error' && errorMessage}
        </Text>

        {status === 'connected' && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Your patch is now connected and syncing data in real-time.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            status === 'connected' && styles.buttonDisabled,
          ]}
          onPress={simulateConnection}
          disabled={status === 'connected'}
        >
          <Text style={styles.buttonText}>
            {status === 'connected' ? 'Connected ✓' : 'Start Connection'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  statusIcon: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusEmoji: {
    fontSize: 64,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  successBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  successText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ConnectView;
