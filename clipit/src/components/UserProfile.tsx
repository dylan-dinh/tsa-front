import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const UserProfile = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>johndoe</Text>
        <Text style={styles.bio}>Gaming enthusiast and content creator</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1.2K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>850</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>245</Text>
          <Text style={styles.statLabel}>Clips</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialCommunityIcons name="share" size={20} color="#9147ff" />
        </TouchableOpacity>
      </View>

      {/* Content Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <MaterialCommunityIcons name="grid" size={24} color="#9147ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <MaterialCommunityIcons name="bookmark-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Content Grid */}
      <View style={styles.contentGrid}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <TouchableOpacity key={item} style={styles.gridItem}>
            <Image
              source={{ uri: `https://picsum.photos/400/400?random=${item}` }}
              style={styles.gridImage}
            />
            <View style={styles.gridItemOverlay}>
              <View style={styles.gridItemStats}>
                <MaterialCommunityIcons name="heart" size={16} color="white" />
                <Text style={styles.gridItemStatText}>1.2K</Text>
                <MaterialCommunityIcons name="comment" size={16} color="white" />
                <Text style={styles.gridItemStatText}>89</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
    width: 40,
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9147ff',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridItemOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  gridItemStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridItemStatText: {
    color: 'white',
    fontSize: 12,
    marginRight: 8,
  },
});

export default UserProfile;
