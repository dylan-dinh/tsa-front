import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Dimensions, Image, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useClips } from '../hooks/useClips';
import ClipCard from './ClipCard';
import ClipPost from './ClipPost';
import { Clip } from '../types';
import storage from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Dashboard = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('People');
  const [activeNav, setActiveNav] = useState('Home');
  const [token, setToken] = useState<string | null>(null);
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;
  
  // TODO: Replace with actual user's followed games
  const mockGameIds = ['509658', '21779', '516575', '32399', '1826300051']; // Mock game IDs for testing
  
  const {
    clips,
    loading,
    loadingMore,
    error,
    hasMore,
    loadClips,
    loadMore,
    refresh,
    clearCache
  } = useClips({
    gameIds: mockGameIds,
    token: token || '',
    pageSize: 20,
    autoLoad: true // Let the hook handle loading
  });
  
  const flatListRef = useRef<FlatList>(null);

  // Helper function to chunk array into groups of n
  const chunk = <T,>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Use individual clips instead of pairs

  // Load token on mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await storage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          console.log('Dashboard: Token loaded, ensuring clips are available');
          // Force a clips load after a short delay to ensure we have data
          setTimeout(() => {
            if (clips.length === 0) {
              console.log('Dashboard: No clips found, forcing load');
              loadClips();
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error loading token:', error);
      }
    };
    loadToken();
  }, []); // Remove loadClips from dependencies

  const handleLogout = async () => {
    try {
      await clearCache();
      await storage.removeItem('token');
      navigation.navigate('Landing');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleRefresh = async () => {
    console.log('Dashboard: Manual refresh triggered');
    await clearCache();
    loadClips();
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

  // Handle clip click
  const handleClipClick = (clip: Clip) => {
    console.log('Dashboard: Clip clicked:', {
      title: clip.Title,
      url: clip.URL,
      embed_url: clip.EmbedURL,
      thumbnail_url: clip.ThumbnailURL
    });
    // For now, just log the click. Videos will play inline when in view.
  };

  // Handle scroll for infinite loading
  const handleEndReached = () => {
    if (hasMore && !loadingMore) {
      console.log('Dashboard: End reached, loading more clips');
      loadMore();
    }
  };

  const renderClip = ({ item, index }: { item: Clip, index: number }) => (
    <View style={styles.clipPost}>
      <ClipPost 
        clip={item}
        onClick={handleClipClick}
      />
    </View>
  );

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

      {/* Refresh and Settings at bottom */}
      <TouchableOpacity style={styles.navItem} onPress={handleRefresh}>
        <MaterialCommunityIcons name="refresh" size={24} color="#111827" />
        <Text style={styles.navItemText}>Refresh</Text>
      </TouchableOpacity>
      
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

  const ClipsFeed = () => {
    console.log('Dashboard: ClipsFeed rendering', { 
      clipsCount: clips.length, 
      loading, 
      error,
      hasMore 
    });
    
    return (
      <View style={styles.clipsContainer}>
        {loading && clips.length === 0 && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading clips...</Text>
          </View>
        )}
        
        {error && clips.length === 0 && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {clips.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={clips}
            renderItem={renderClip}
            keyExtractor={(item, index) => `clip-${index}`}
            style={styles.clipsFeed}
            showsVerticalScrollIndicator={false}
            snapToInterval={Dimensions.get('window').height}
            snapToAlignment="start"
            decelerationRate="fast"
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').height,
              offset: Dimensions.get('window').height * index,
              index,
            })}
          />
        )}
        
        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <Text style={styles.loadingMoreText}>Loading more clips...</Text>
          </View>
        )}
        

      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!isMobile && <Sidebar />}
      
      <View style={[styles.mainContent, isMobile && styles.mainContentMobile]}>
        <ClipsFeed />
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
    width: '100%',
    maxWidth: '100%',
  },
  feedContent: {
    width: '100%',
    paddingBottom: 20,
    minHeight: '100%',
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
  postCard: {
    backgroundColor: '#ffffff',
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: isMobile ? 16 : 0,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  postUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  postTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postActionLeft: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  postInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postLikes: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  postCaption: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  postCaptionUsername: {
    fontWeight: '600',
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
  // Clips styles
  clipsContainer: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#9147ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  clipsFeed: {
    flex: 1,
    width: '100%',
  },
  clipPost: {
    width: '100%',
    height: Dimensions.get('window').height,
    marginBottom: 0,
  },
  loadingMoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#6b7280',
  },
  endContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  endText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default Dashboard;