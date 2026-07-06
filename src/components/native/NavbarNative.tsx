import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'graph', label: 'Trends', icon: '📊' },
    { id: 'calendar', label: 'Cycle', icon: '📅' },
    { id: 'connect', label: 'Patch', icon: '🔗' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.id)}
          >
            <Text
              style={[
                styles.tabIcon,
                activeTab === tab.id && styles.activeIcon,
              ]}
            >
              {tab.icon}
            </Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  activeIcon: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#FF6B9D',
    fontWeight: '600',
  },
});

export default Navbar;
