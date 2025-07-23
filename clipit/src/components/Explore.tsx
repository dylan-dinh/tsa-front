import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useClips } from '../hooks/useClips';
import VideoFeed from './VideoFeed';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { Clip } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Explore = () => {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('content');
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  // Mock clips for mobile testing
  const mockClips: Clip[] = [
    {
      ID: 1,
      TwitchID: 'SuspiciousDifferentPanLitFam-mMLLjoIPEvQAgGya',
      Title: 'Amazing Gaming Moment',
      BroadcasterName: 'GamerPro',
      BroadcasterID: 12345,
      GameID: '32982',
      VideoID: 67890,
      CreatorID: 11111,
      CreatorName: 'GamerPro',
      EmbedURL: 'https://clips.twitch.tv/embed?clip=SuspiciousDifferentPanLitFam-mMLLjoIPEvQAgGya',
      ThumbnailURL: 'https://clips-media-assets2.twitch.tv/AT-cm%7CSuspiciousDifferentPanLitFam-mMLLjoIPEvQAgGya-preview-480x272.jpg',
      ViewCount: 15000,
      Duration: 30,
      URL: 'https://clips.twitch.tv/SuspiciousDifferentPanLitFam-mMLLjoIPEvQAgGya',
      CreatedAt: '2024-01-01T00:00:00Z',
      UpdatedAt: '2024-01-01T00:00:00Z'
    },
    {
      ID: 2,
      TwitchID: 'DreamyDiligentShieldAllenHuhu-arrh4IQrhKoG-KtX',
      Title: 'Epic Victory',
      BroadcasterName: 'StreamMaster',
      BroadcasterID: 54321,
      GameID: '21779',
      VideoID: 98765,
      CreatorID: 22222,
      CreatorName: 'StreamMaster',
      EmbedURL: 'https://clips.twitch.tv/embed?clip=DreamyDiligentShieldAllenHuhu-arrh4IQrhKoG-KtX',
      ThumbnailURL: 'https://clips-media-assets2.twitch.tv/AT-cm%7CDreamyDiligentShieldAllenHuhu-arrh4IQrhKoG-KtX-preview-480x272.jpg',
      ViewCount: 25000,
      Duration: 45,
      URL: 'https://clips.twitch.tv/DreamyDiligentShieldAllenHuhu-arrh4IQrhKoG-KtX',
      CreatedAt: '2024-01-01T00:00:00Z',
      UpdatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  // Popular game IDs for clips (you can expand this list)
  const popularGameIds = [
    '32982', // Grand Theft Auto V
    '21779', // League of Legends
    '33214', // Fortnite
    '29595', // Dota 2
    '32399', // Counter-Strike: Global Offensive
    '27471', // Minecraft
    '32982', // Grand Theft Auto V
    '21779', // League of Legends
    '33214', // Fortnite
    '29595', // Dota 2
  ];

  const {
    clips,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    clearCache
  } = useClips({
    gameIds: popularGameIds,
    token: token || '',
    pageSize: 20,
    autoLoad: true
  });

  // Use mock clips for mobile, real clips for web
  const displayClips = Platform.OS === 'web' ? clips : mockClips;
  const displayLoading = Platform.OS === 'web' ? loading : false;
  const displayError = Platform.OS === 'web' ? error : null;

  const handleBackToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const handleBackToLanding = () => {
    navigation.navigate('Landing');
  };

  const handleClipClick = (clip: Clip) => {
    console.log('Explore: Clip clicked:', {
      title: clip.Title,
      url: clip.URL,
      embed_url: clip.EmbedURL,
      thumbnail_url: clip.ThumbnailURL
    });
    
    if (Platform.OS === 'web' && clip.EmbedURL) {
      // For web, open in new tab
      window.open(clip.EmbedURL, '_blank');
    } else {
      // For mobile, show alert for now
      Alert.alert('Clip', `Playing: ${clip.Title || 'Untitled Clip'}`);
    }
  };

  const handleLoadMore = () => {
    if (Platform.OS === 'web' && hasMore && !loadingMore) {
      loadMore();
    }
  };

  const handleRefresh = () => {
    if (Platform.OS === 'web') {
      refresh();
    }
  };

  const handleClearCache = () => {
    if (Platform.OS === 'web') {
      clearCache();
    }
  };

  const contentTabs = [
    { id: 'content', title: 'Popular Clips', icon: 'video', iconActive: 'video' },
    { id: 'fame', title: 'Trending', icon: 'trending-up', iconActive: 'trending-up' },
    { id: 'tagged', title: 'Discover', icon: 'compass', iconActive: 'compass' },
  ];

  const ClipsFeed = () => {
    console.log('Explore: ClipsFeed rendering', { 
      clipsCount: displayClips.length, 
      loading: displayLoading, 
      error: displayError,
      hasMore: Platform.OS === 'web' ? hasMore : false,
      platform: Platform.OS
    });
    
    if (displayLoading && displayClips.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading clips...</Text>
        </View>
      );
    }
    
    if (displayError && displayClips.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {displayError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.clipsContainer}>
        <VideoFeed
          clips={displayClips}
          onClipClick={handleClipClick}
          onEndReached={handleLoadMore}
        />
        
        {Platform.OS === 'web' && loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <Text style={styles.loadingMoreText}>Loading more clips...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ClipsFeed />;
      case 'fame':
        return (
          <View style={styles.emptyContent}>
            <MaterialCommunityIcons name="trending-up" size={64} color="#9ca3af" />
            <Text style={styles.emptyContentTitle}>Trending</Text>
            <Text style={styles.emptyContentText}>Trending clips will appear here</Text>
          </View>
        );
      case 'tagged':
        return (
          <View style={styles.emptyContent}>
            <MaterialCommunityIcons name="compass" size={64} color="#9ca3af" />
            <Text style={styles.emptyContentTitle}>Discover</Text>
            <Text style={styles.emptyContentText}>Discover new content here</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Navigation */}
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={handleBackToDashboard} style={styles.navButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>Explore</Text>
        <View style={styles.headerActions}>
          {Platform.OS === 'web' && (
            <>
              <TouchableOpacity onPress={handleRefresh} style={styles.actionButton}>
                <MaterialCommunityIcons name="refresh" size={20} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClearCache} style={styles.actionButton}>
                <MaterialCommunityIcons name="delete-sweep" size={20} color="#111827" />
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={handleBackToLanding} style={styles.navButton}>
            <MaterialCommunityIcons name="home" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Tabs */}
      <View style={styles.tabsContainer}>
        {contentTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <MaterialCommunityIcons
              name={activeTab === tab.id ? tab.iconActive as any : tab.icon as any}
              size={20}
              color={activeTab === tab.id ? '#9147ff' : '#6b7280'}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navButton: {
    padding: 8,
  },
  headerUsername: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#9147ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#9147ff',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
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
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContentText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingMoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default Explore; 