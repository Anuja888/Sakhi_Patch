import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TemperatureReading, UserProfile } from '../../types';

interface CalendarViewProps {
  readings: TemperatureReading[];
  profile: UserProfile;
}

const CalendarView: React.FC<CalendarViewProps> = ({ readings, profile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getDayType = (day: number) => {
    const cycleDay = (day % 28) || 28;
    if (cycleDay <= 5) return 'period';
    if (cycleDay >= 12 && cycleDay <= 17) return 'fertile';
    if (cycleDay > 17) return 'luteal';
    return 'follicular';
  };

  const dayTypeColors = {
    period: { bg: '#FFE5ED', text: '#FF6B9D' },
    fertile: { bg: '#E8F5E9', text: '#4CAF50' },
    luteal: { bg: '#FFF3E0', text: '#FFC107' },
    follicular: { bg: '#E0F2F1', text: '#26A69A' },
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth(year, currentDate.getMonth()); i++) {
    days.push(i);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Month Header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={prevMonth}>
          <Text style={styles.navButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {monthName} {year}
        </Text>
        <TouchableOpacity onPress={nextMonth}>
          <Text style={styles.navButton}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Day Headers */}
      <View style={styles.dayHeadersContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <View key={d} style={styles.dayHeaderCell}>
            <Text style={styles.dayHeaderText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const dayType = getDayType(day);
          const colors = dayTypeColors[dayType];

          return (
            <View
              key={day}
              style={[styles.dayCell, { backgroundColor: colors.bg }]}
            >
              <Text style={[styles.dayNumber, { color: colors.text }]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: dayTypeColors.period.bg },
            ]}
          />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: dayTypeColors.follicular.bg },
            ]}
          />
          <Text style={styles.legendText}>Follicular</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: dayTypeColors.fertile.bg },
            ]}
          />
          <Text style={styles.legendText}>Fertile</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: dayTypeColors.luteal.bg },
            ]}
          />
          <Text style={styles.legendText}>Luteal</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  navButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayHeadersContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  legend: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

export default CalendarView;
