import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TemperatureReading, UserProfile, DeviceInfo } from '../../types';
import { useCycleLogic } from '../../hooks/useCycleLogic';

interface DashboardProps {
  readings: TemperatureReading[];
  profile: UserProfile;
  device: DeviceInfo | null;
}

const Dashboard: React.FC<DashboardProps> = ({ readings, profile, device }) => {
  const { dayOfCycle, phase, pcosResult } = useCycleLogic(readings, profile);
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;

  const phaseColors = {
    period: { bg: '#FFE5ED', text: '#FF6B9D' },
    follicular: { bg: '#E0F2F1', text: '#26A69A' },
    fertile: { bg: '#E8F5E9', text: '#4CAF50' },
    luteal: { bg: '#FFF3E0', text: '#FFC107' },
  };

  const phaseLabels = {
    period: 'Period Phase',
    follicular: 'Follicular Phase',
    fertile: 'Fertile Window',
    luteal: 'Luteal Phase',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Device Status Card */}
      <View style={styles.card}>
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: device ? '#4CAF50' : '#ccc' },
              ]}
            />
            <Text style={styles.deviceName}>
              {device ? device.name : 'No Device Connected'}
            </Text>
          </View>
          {device && (
            <View style={styles.batteryInfo}>
              <Text style={styles.batteryPercent}>{device.batteryPercent}%</Text>
            </View>
          )}
        </View>
        <Text style={styles.deviceSubtitle}>
          {device
            ? 'Last sync: 2 min ago'
            : 'Connect your SakhiPatch to start tracking'}
        </Text>
      </View>

      {/* Temperature Display */}
      <View style={styles.temperatureCard}>
        <View style={styles.temperatureIcon}>
          <Text style={styles.temperatureIconText}>🌡️</Text>
        </View>
        <Text style={styles.temperatureLabel}>Today's Temperature</Text>
        <View style={styles.temperatureDisplay}>
          <Text style={styles.temperatureValue}>
            {latestReading ? latestReading.temperature.toFixed(1) : '--.-'}
          </Text>
          <Text style={styles.temperatureUnit}>°C</Text>
        </View>
        <View style={styles.temperatureRange}>
          <Text style={styles.rangeLabel}>36.0°C</Text>
          <View style={styles.rangeBar}>
            <View
              style={[
                styles.rangeIndicator,
                {
                  width: latestReading
                    ? `${((latestReading.temperature - 36) / 1.5) * 100}%`
                    : '0%',
                },
              ]}
            />
          </View>
          <Text style={styles.rangeLabel}>37.5°C</Text>
        </View>
      </View>

      {/* Cycle Info Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridLabel}>Cycle Day</Text>
          <Text style={styles.gridValue}>Day {dayOfCycle}</Text>
          <Text style={styles.gridSubtext}>
            of {profile.averageCycleLength} days
          </Text>
        </View>
        <View
          style={[
            styles.gridItem,
            { backgroundColor: phaseColors[phase].bg },
          ]}
        >
          <Text style={[styles.gridLabel, { color: phaseColors[phase].text }]}>
            {phaseLabels[phase]}
          </Text>
          <Text
            style={[
              styles.gridValue,
              { color: phaseColors[phase].text },
            ]}
          >
            {phase === 'fertile' ? 'High Fertility' : 'Normal'}
          </Text>
        </View>
      </View>

      {/* PCOS Risk Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              pcosResult.risk === 'low'
                ? '#fff'
                : 'rgba(255, 193, 7, 0.05)',
            borderColor:
              pcosResult.risk === 'low'
                ? '#ddd'
                : 'rgba(255, 193, 7, 0.2)',
          },
        ]}
      >
        <View style={styles.pcosHeader}>
          <Text style={styles.pcosTitle}>PCOS Risk Assessment</Text>
          <View
            style={[
              styles.riskBadge,
              {
                backgroundColor:
                  pcosResult.risk === 'low'
                    ? 'rgba(76, 175, 80, 0.1)'
                    : pcosResult.risk === 'medium'
                      ? 'rgba(255, 193, 7, 0.1)'
                      : 'rgba(244, 67, 54, 0.1)',
              },
            ]}
          >
            <Text
              style={[
                styles.riskText,
                {
                  color:
                    pcosResult.risk === 'low'
                      ? '#4CAF50'
                      : pcosResult.risk === 'medium'
                        ? '#FFC107'
                        : '#F44336',
                },
              ]}
            >
              {pcosResult.risk.toUpperCase()} Risk
            </Text>
          </View>
        </View>
        <Text style={styles.pcosMessage}>{pcosResult.message}</Text>
        <TouchableOpacity style={styles.analysisButton}>
          <Text style={styles.analysisButtonText}>View Detailed Analysis →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  batteryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#26A69A',
  },
  deviceSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  temperatureCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 32,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  temperatureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  temperatureIconText: {
    fontSize: 32,
  },
  temperatureLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  temperatureDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  temperatureValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
  },
  temperatureUnit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bbb',
    marginLeft: 4,
  },
  temperatureRange: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#bbb',
  },
  rangeBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  rangeIndicator: {
    height: '100%',
    backgroundColor: '#FF6B9D',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  gridSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  pcosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pcosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  riskText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  pcosMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  analysisButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  analysisButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Dashboard;
