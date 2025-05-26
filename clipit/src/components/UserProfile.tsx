import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserProfile = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('content');
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  const handleBackToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const handleBackToLanding = () => {
    navigation.navigate('Landing');
  };

  const handleSocialLink = (platform: string, url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const socialLinks = [
    { name: 'twitch', icon: 'twitch', color: '#9147ff', url: 'https://twitch.tv/johndoe' },
    { name: 'youtube', icon: 'youtube', color: '#ff0000', url: 'https://youtube.com/@johndoe' },
    { name: 'instagram', icon: 'instagram', color: '#e4405f', url: 'https://instagram.com/johndoe' },
    { name: 'tiktok', icon: 'music-note', color: '#000000', url: 'https://tiktok.com/@johndoe' },
  ];

  const contentTabs = [
    { id: 'content', title: 'Your Content', icon: 'video', iconActive: 'video' },
    { id: 'fame', title: 'Hall of Fame', icon: 'crown-outline', iconActive: 'crown' },
    { id: 'tagged', title: 'Tagged with', icon: 'share-outline', iconActive: 'share' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <View style={styles.emptyContent}>
            <MaterialCommunityIcons name="video-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyContentTitle}>No content yet</Text>
            <Text style={styles.emptyContentText}>Start creating and sharing your clips!</Text>
          </View>
        );
      case 'fame':
        return (
          <View style={styles.emptyContent}>
            <MaterialCommunityIcons name="crown-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyContentTitle}>Hall of Fame</Text>
            <Text style={styles.emptyContentText}>Your best clips will appear here</Text>
          </View>
        );
      case 'tagged':
        return (
          <View style={styles.emptyContent}>
            <MaterialCommunityIcons name="share-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyContentTitle}>Tagged Content</Text>
            <Text style={styles.emptyContentText}>Content you've been tagged in will show here</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Navigation */}
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={handleBackToDashboard} style={styles.navButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerUsername}>@johndoe</Text>
        <TouchableOpacity onPress={handleBackToLanding} style={styles.navButton}>
          <MaterialCommunityIcons name="home" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Profile Summary Layout */}
      <View style={styles.profileSection}>
        <View style={[styles.profileContainer, isMobile && styles.profileContainerMobile]}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
              style={styles.profileImage}
            />
          </View>

          {/* Profile Info */}
          <View style={[styles.profileInfo, isMobile && styles.profileInfoMobile]}>
            {/* Full Name */}
            <Text style={styles.fullName}>John Doe</Text>
            
            {/* Bio */}
            <Text style={styles.bio}>
              🎮 Gaming enthusiast and content creator{'\n'}
              🔥 Streaming daily on Twitch{'\n'}
              📧 Contact: john@clipit.com
            </Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>245</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>850</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.socialLinksContainer}>
          <Text style={styles.socialLinksTitle}>Find me on:</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map((social) => (
              <TouchableOpacity
                key={social.name}
                style={[styles.socialButton, { borderColor: social.color }]}
                onPress={() => handleSocialLink(social.name, social.url)}
              >
                <MaterialCommunityIcons
                  name={social.icon as any}
                  size={24}
                  color={social.color}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.editButton]}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shareButton]}>
            <MaterialCommunityIcons name="share-outline" size={20} color="#9147ff" />
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Tabs */}
      <View style={styles.tabsSection}>
        <View style={styles.tabsContainer}>
          {contentTabs.map((tab, index) => (
            <View key={tab.id} style={styles.tabWrapper}>
              <TouchableOpacity
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <MaterialCommunityIcons
                  name={activeTab === tab.id ? tab.iconActive as any : tab.icon as any}
                  size={20}
                  color={activeTab === tab.id ? '#9147ff' : '#6b7280'}
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab.id ? styles.tabTextActive : styles.tabTextInactive
                ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
              {index < contentTabs.length - 1 && <View style={styles.tabDivider} />}
            </View>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </View>
    </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerUsername: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  profileContainerMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: isMobile ? 0 : 24,
    marginBottom: isMobile ? 16 : 0,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e5e7eb',
  },
  profileInfo: {
    flex: 1,
  },
  profileInfoMobile: {
    alignItems: 'center',
    width: '100%',
  },
  fullName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: isMobile ? 'center' : 'left',
  },
  bio: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: isMobile ? 'center' : 'left',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  socialLinksContainer: {
    marginBottom: 24,
  },
  socialLinksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    textAlign: isMobile ? 'center' : 'left',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: isMobile ? 'center' : 'flex-start',
    gap: 12,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#9147ff',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  shareButtonText: {
    color: '#9147ff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  tabWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9147ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  tabTextActive: {
    color: '#9147ff',
  },
  tabTextInactive: {
    color: '#6b7280',
  },
  tabDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
  },
  tabContent: {
    minHeight: 300,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyContentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContentText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default UserProfile;
