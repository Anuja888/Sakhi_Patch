import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TemperatureReading, UserProfile } from '../../types';

interface TrendsGraphProps {
  readings: TemperatureReading[];
  profile: UserProfile;
}

const TrendsGraph: React.FC<TrendsGraphProps> = ({ readings, profile }) => {
  const [range, setRange] = React.useState<7 | 30 | 90>(7);

  const stats = useMemo(() => {
    const cutoff = Date.now() / 1000 - range * 24 * 60 * 60;
    const filtered = readings.filter((r) => r.timestamp > cutoff);
    const temps = filtered.map((r) => r.temperature);
    const avg =
      temps.length > 0
        ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
        : '--';
    const max =
      temps.length > 0 ? Math.max(...temps).toFixed(2) : '--';
    const min =
      temps.length > 0 ? Math.min(...temps).toFixed(2) : '--';
    return { avg, max, min, count: temps.length };
  }, [readings, range]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Temperature Trends</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadText}>📥</Text>
        </TouchableOpacity>
      </View>

      {/* Range Selector */}
      <View style={styles.rangeSelector}>
        {[7, 30, 90].map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.rangeButton,
              range === r && styles.rangeButtonActive,
            ]}
            onPress={() => setRange(r as 7 | 30 | 90)}
          >
            <Text
              style={[
                styles.rangeButtonText,
                range === r && styles.rangeButtonTextActive,
              ]}
            >
              {r}d
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{stats.avg}°C</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Highest</Text>
          <Text style={styles.statValue}>{stats.max}°C</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Lowest</Text>
          <Text style={styles.statValue}>{stats.min}°C</Text>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartPlaceholderText}>
          📊 Chart visualization
        </Text>
        <Text style={styles.chartSubtext}>
          {stats.count} readings in selected range
        </Text>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Temperature Tracking</Text>
        <Text style={styles.infoText}>
          Regular temperature tracking helps identify your cycle phases and
          predict fertility windows.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  downloadBtn: {
    padding: 8,
  },
  downloadText: {
    fontSize: 18,
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  rangeButtonActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  rangeButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  chartPlaceholder: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    fontSize: 28,
    marginBottom: 8,
  },
  chartSubtext: {
    fontSize: 14,
    color: '#999',
  },
  infoBox: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});

export default TrendsGraph;
