import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { RootStackParamList } from '../types/navigation';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ContentCard } from './ContentCard';
import { LoadingSpinner } from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { EmptyState } from './EmptyState';
import { fetchContent, ContentItem } from '../services/contentService';
import Search from './Search';
import Explore from './Explore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Dashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('People');
  const [activeNav, setActiveNav] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;

  // Infinite scroll hook
  const {
    data: content,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useInfiniteScroll<ContentItem>({
    fetchData: fetchContent,
    pageSize: 10
  });

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      navigation.navigate('Landing');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileNavigation = () => {
    navigation.navigate('UserProfile');
    setActiveNav('Profile');
  };

  const handleLandingNavigation = () => {
    navigation.navigate('Landing');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const navigationItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'Search', icon: 'magnify', activeIcon: 'magnify' },
    { name: 'Explore', icon: 'compass-outline', activeIcon: 'compass' },
    { name: 'Messages', icon: 'message-outline', activeIcon: 'message' },
    { name: 'Notifications', icon: 'bell-outline', activeIcon: 'bell' },
    { name: 'Profile', icon: 'account-outline', activeIcon: 'account', onPress: handleProfileNavigation },
  ];

  const followedUsers = [
    { id: 1, username: 'john_doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, username: 'jane_smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, username: 'gamer_pro', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, username: 'streamer_x', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, username: 'clip_master', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 6, username: 'content_king', avatar: 'https://i.pravatar.cc/150?img=6' },
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

      {/* Settings at bottom */}
      <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
        <MaterialCommunityIcons name="cog-outline" size={24} color="#111827" />
        <Text style={styles.navItemText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const FeedTabs = () => (
    <View style={styles.tabsContainer}>
      {['People', 'Hub'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.tabActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab ? styles.tabTextActive : styles.tabTextInactive
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const FollowedUsersCarousel = () => (
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      >
        {followedUsers.map((user) => (
          <TouchableOpacity key={user.id} style={styles.userBubble}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <Text style={styles.userName}>{user.username}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (hasMore && !loading) {
        loadMore();
      }
    }
  };

  const renderContent = () => {
    if (error) {
      return <ErrorMessage message={error} onClose={() => refresh()} />;
    }

    if (content.length === 0 && !loading) {
      return (
        <EmptyState
          title="No content found"
          message="Start exploring to see some amazing clips!"
          actionText="Refresh"
          onAction={handleRefresh}
        />
      );
    }

    return (
      <>
        {content.map((item) => (
          <ContentCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            author={item.author}
            timestamp={item.timestamp}
            likes={item.likes}
            views={item.views}
          />
        ))}
        
        {loading && hasMore && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        )}
      </>
    );
  };

  const renderMainContent = () => {
    switch (activeNav) {
      case 'Search':
        return <Search />;
      case 'Explore':
        return <Explore />;
      case 'Messages':
        return (
          <View style={styles.placeholderContainer}>
            <MaterialCommunityIcons name="message" size={64} color="#d1d5db" />
            <Text style={styles.placeholderTitle}>Messages</Text>
            <Text style={styles.placeholderText}>Chat with friends coming soon!</Text>
          </View>
        );
      case 'Notifications':
        return (
          <View style={styles.placeholderContainer}>
            <MaterialCommunityIcons name="bell" size={64} color="#d1d5db" />
            <Text style={styles.placeholderTitle}>Notifications</Text>
            <Text style={styles.placeholderText}>Stay updated with notifications!</Text>
          </View>
        );
      default:
        return (
          <>
            <FeedTabs />
            <ScrollView 
              style={styles.feedContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feedContent}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={['#9147ff']}
                  tintColor="#9147ff"
                />
              }
            >
              <FollowedUsersCarousel />
              {renderContent()}
            </ScrollView>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      {!isMobile && <Sidebar />}
      
      <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
        {renderMainContent()}
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
  },
  mainContentMobile: {
    marginLeft: 0,
    marginBottom: 60,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: Platform.OS === 'web' ? 'sticky' as any : 'relative',
    top: 0,
    zIndex: 5,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#9147ff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#9147ff',
  },
  tabTextInactive: {
    color: '#6b7280',
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    maxWidth: isMobile ? width : 600,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: isMobile ? 0 : 20,
  },
  carouselContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  userBubble: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  userName: {
    marginTop: 8,
    fontSize: 12,
    color: '#111827',
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
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