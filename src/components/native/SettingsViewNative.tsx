import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { UserProfile, DeviceInfo } from '../../types';
import { LANGUAGES } from '../../constants';

interface SettingsViewProps {
  profile: UserProfile;
  onProfileUpdate: (p: UserProfile) => void;
  device: DeviceInfo | null;
  onDisconnect: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onProfileUpdate,
  device,
  onDisconnect,
}) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [cycleLength, setCycleLength] = useState(profile.averageCycleLength.toString());

  const handleSave = () => {
    onProfileUpdate({
      ...profile,
      name,
      age: parseInt(age) || 25,
      averageCycleLength: parseInt(cycleLength) || 28,
    });
    setEditingProfile(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderIcon}>👤</Text>
          <Text style={styles.sectionTitle}>Account & Profile</Text>
        </View>

        {!editingProfile ? (
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setEditingProfile(true)}
          >
            <View>
              <Text style={styles.settingLabel}>{profile.name}</Text>
              <Text style={styles.settingSubtitle}>
                {profile.age} years • {profile.averageCycleLength} Day Cycle
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editForm}>
            <Text style={styles.editLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />

            <Text style={styles.editLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="Age"
            />

            <Text style={styles.editLabel}>Cycle Length (days)</Text>
            <TextInput
              style={styles.input}
              value={cycleLength}
              onChangeText={setCycleLength}
              keyboardType="number-pad"
              placeholder="Cycle length"
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setEditingProfile(false)}
              >
                <Text style={styles.buttonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingIcon}>🌐</Text>
            <Text style={styles.settingLabel}>Language</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>
              {LANGUAGES[profile.language]}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Device Section */}
      {device && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderIcon}>📱</Text>
            <Text style={styles.sectionTitle}>Device Settings</Text>
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>{device.name}</Text>
              <Text style={styles.settingSubtitle}>
                Battery: {device.batteryPercent}%
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={onDisconnect}
          >
            <Text style={styles.dangerText}>🔌 Disconnect Device</Text>
            <Text style={[styles.chevron, styles.dangerChevron]}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* About Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderIcon}>ℹ️</Text>
          <Text style={styles.sectionTitle}>About</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Terms of Service</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingVertical: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeaderIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  dangerChevron: {
    color: '#F44336',
  },
  editForm: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  editLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#FF6B9D',
  },
  buttonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SettingsView;
