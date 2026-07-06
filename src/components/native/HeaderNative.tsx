import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const Header: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoDot} />
          </View>
          <Text style={styles.title}>Saheli Patch</Text>
        </View>
        <TouchableOpacity style={styles.bellIcon}>
          <Text style={styles.bellText}>🔔</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#FF6B9D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDot: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    opacity: 0.8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  bellIcon: {
    padding: 8,
  },
  bellText: {
    fontSize: 24,
  },
});

export default Header;
