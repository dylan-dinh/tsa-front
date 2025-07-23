import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Dashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeNav, setActiveNav] = useState('Home');
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  const handleExploreNavigation = () => {
    console.log('Dashboard: Navigating to Explore');
    navigation.navigate('Explore');
    setActiveNav('Explore');
  };

  const handleProfileNavigation = () => {
    navigation.navigate('UserProfile');
    setActiveNav('Profile');
  };

  const handleLandingNavigation = () => {
    navigation.navigate('Landing');
  };

  const navigationItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Search', icon: 'magnify', activeIcon: 'magnify' },
    { name: 'Explore', icon: 'compass-outline', activeIcon: 'compass', onPress: handleExploreNavigation },
    { name: 'Messages', icon: 'message-outline', activeIcon: 'message' },
    { name: 'Notifications', icon: 'bell-outline', activeIcon: 'bell' },
    { name: 'Profile', icon: 'account-outline', activeIcon: 'account', onPress: handleProfileNavigation },
  ];

  const Sidebar = () => (
    <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      {/* Logo */}
      <TouchableOpacity onPress={handleLandingNavigation} style={styles.logoContainer}>
        <Text style={styles.logo}>ClipIt</Text>
      </TouchableOpacity>

      {/* Navigation Items */}
      <View style={styles.navContainer}>
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.navItem,
              activeNav === item.name && styles.navItemActive
            ]}
            onPress={() => {
              setActiveNav(item.name);
              if (item.onPress) item.onPress();
            }}
          >
            <MaterialCommunityIcons
              name={activeNav === item.name ? item.activeIcon as any : item.icon as any}
              size={24}
              color={activeNav === item.name ? '#9147ff' : '#111827'}
            />
            <Text style={[
              styles.navItemText,
              activeNav === item.name && styles.navItemTextActive
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!isMobile && <Sidebar />}
      
      <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Dashboard</Text>
          <Text style={styles.emptyText}>Welcome to your dashboard!</Text>
          <Text style={styles.emptySubtext}>Click "Explore" to view clips</Text>
        </View>
      </View>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <View style={styles.bottomNav}>
          {navigationItems.slice(0, 5).map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.bottomNavItem}
              onPress={() => {
                setActiveNav(item.name);
                if (item.onPress) item.onPress();
              }}
            >
              <MaterialCommunityIcons
                name={activeNav === item.name ? item.activeIcon as any : item.icon as any}
                size={24}
                color={activeNav === item.name ? '#9147ff' : '#6b7280'}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;
const sidebarWidth = isMobile ? 0 : 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  sidebar: {
    width: sidebarWidth,
    height: height,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    paddingVertical: 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  sidebarMobile: {
    display: 'none',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  navContainer: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#f3f4f6',
  },
  navItemText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  navItemTextActive: {
    fontWeight: '700',
    color: '#9147ff',
  },
  mainContent: {
    flex: 1,
    marginLeft: sidebarWidth,
    backgroundColor: '#fafafa',
  },
  mainContentMobile: {
    marginLeft: 0,
    marginBottom: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  bottomNavItem: {
    padding: 8,
  },
});

export default Dashboard;