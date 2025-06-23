import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ContentCard } from './ContentCard';
import { ContentItem } from '../services/contentService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  isVerified: boolean;
  isFollowing: boolean;
}

// Données mock pour les utilisateurs
const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    followers: 12500,
    isVerified: true,
    isFollowing: false
  },
  {
    id: '2',
    username: 'jane_smith',
    displayName: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    followers: 8900,
    isVerified: false,
    isFollowing: true
  },
  {
    id: '3',
    username: 'gamer_pro',
    displayName: 'Gamer Pro',
    avatar: 'https://i.pravatar.cc/150?img=3',
    followers: 45600,
    isVerified: true,
    isFollowing: false
  },
  {
    id: '4',
    username: 'streamer_x',
    displayName: 'Streamer X',
    avatar: 'https://i.pravatar.cc/150?img=4',
    followers: 23400,
    isVerified: true,
    isFollowing: true
  },
  {
    id: '5',
    username: 'clip_master',
    displayName: 'Clip Master',
    avatar: 'https://i.pravatar.cc/150?img=5',
    followers: 18900,
    isVerified: false,
    isFollowing: false
  },
  {
    id: '6',
    username: 'content_king',
    displayName: 'Content King',
    avatar: 'https://i.pravatar.cc/150?img=6',
    followers: 67800,
    isVerified: true,
    isFollowing: false
  },
  {
    id: '7',
    username: 'tech_guru',
    displayName: 'Tech Guru',
    avatar: 'https://i.pravatar.cc/150?img=7',
    followers: 34500,
    isVerified: true,
    isFollowing: true
  },
  {
    id: '8',
    username: 'music_lover',
    displayName: 'Music Lover',
    avatar: 'https://i.pravatar.cc/150?img=8',
    followers: 12300,
    isVerified: false,
    isFollowing: false
  }
];

// Données mock pour les suggestions de contenu
const mockSuggestions: ContentItem[] = [
  {
    id: 's1',
    title: 'Amazing Gaming Highlights - Best Plays of the Week',
    description: 'Check out these incredible gaming moments from top streamers around the world.',
    imageUrl: 'https://picsum.photos/400/200?random=11',
    author: 'GamingCentral',
    timestamp: '2 hours ago',
    likes: 1247,
    views: 45678,
    category: 'Gaming',
    duration: '15:30'
  },
  {
    id: 's2',
    title: 'How to Master React Native in 2024',
    description: 'Complete guide to building mobile apps with React Native.',
    imageUrl: 'https://picsum.photos/400/200?random=12',
    author: 'CodeMaster',
    timestamp: '5 hours ago',
    likes: 892,
    views: 23456,
    category: 'Programming',
    duration: '45:20'
  },
  {
    id: 's3',
    title: 'Cooking with Chef Sarah - Italian Pasta Masterclass',
    description: 'Learn to make authentic Italian pasta from scratch.',
    imageUrl: 'https://picsum.photos/400/200?random=13',
    author: 'ChefSarah',
    timestamp: '1 day ago',
    likes: 2156,
    views: 78901,
    category: 'Cooking',
    duration: '32:15'
  },
  {
    id: 's4',
    title: 'Travel Vlog: Exploring Hidden Gems in Japan',
    description: 'Join us on an adventure through the lesser-known spots in Japan.',
    imageUrl: 'https://picsum.photos/400/200?random=14',
    author: 'TravelExplorer',
    timestamp: '2 days ago',
    likes: 3456,
    views: 123456,
    category: 'Travel',
    duration: '28:45'
  }
];

const Search = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  // Fonction de recherche fuzzy modérée
  const fuzzySearch = (query: string, users: User[]): User[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const results: Array<{ user: User; score: number }> = [];
    
    users.forEach(user => {
      const username = user.username.toLowerCase();
      const displayName = user.displayName.toLowerCase();
      
      let score = 0;
      
      // Recherche exacte (score élevé)
      if (username === searchTerm || displayName === searchTerm) {
        score = 100;
      }
      // Commence par le terme de recherche (bon score)
      else if (username.startsWith(searchTerm) || displayName.startsWith(searchTerm)) {
        score = 80;
      }
      // Contient le terme de recherche (score moyen)
      else if (username.includes(searchTerm) || displayName.includes(searchTerm)) {
        score = 60;
      }
      // Recherche par mots (score faible)
      else {
        const searchWords = searchTerm.split(' ');
        const usernameWords = username.split('_');
        const displayWords = displayName.split(' ');
        
        searchWords.forEach(word => {
          if (usernameWords.some(w => w.startsWith(word))) score += 30;
          if (displayWords.some(w => w.startsWith(word))) score += 30;
        });
      }
      
      if (score > 0) {
        results.push({ user, score });
      }
    });
    
    // Trier par score décroissant et limiter à 10 résultats
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(result => result.user);
  };

  // Effectuer la recherche quand la requête change
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simuler un délai de recherche
      const timer = setTimeout(() => {
        const results = fuzzySearch(searchQuery, mockUsers);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleUserPress = (user: User) => {
    // Navigation vers le profil utilisateur
    console.log('Navigate to user profile:', user.username);
    // navigation.navigate('UserProfile', { userId: user.id });
  };

  const handleFollowPress = (user: User) => {
    // Logique pour suivre/ne plus suivre
    console.log('Follow/Unfollow user:', user.username);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.userNameRow}>
          <Text style={styles.userDisplayName}>{item.displayName}</Text>
          {item.isVerified && (
            <MaterialCommunityIcons name="check-decagram" size={16} color="#9147ff" />
          )}
        </View>
        <Text style={styles.userUsername}>@{item.username}</Text>
        <Text style={styles.userFollowers}>{item.followers.toLocaleString()} followers</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton,
          item.isFollowing && styles.followingButton
        ]}
        onPress={() => handleFollowPress(item)}
      >
        <Text style={[
          styles.followButtonText,
          item.isFollowing && styles.followingButtonText
        ]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderContentItem = ({ item }: { item: ContentItem }) => (
    <ContentCard
      id={item.id}
      title={item.title}
      description={item.description}
      imageUrl={item.imageUrl}
      author={item.author}
      timestamp={item.timestamp}
      likes={item.likes}
      views={item.views}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header avec barre de recherche */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        {searchQuery.length > 0 ? (
          // Résultats de recherche
          <View style={styles.searchResults}>
            <Text style={styles.sectionTitle}>
              {isSearching ? 'Searching...' : `Search results (${searchResults.length})`}
            </Text>
            
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9147ff" />
                <Text style={styles.loadingText}>Searching users...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.userList}
              />
            ) : (
              <View style={styles.noResults}>
                <MaterialCommunityIcons name="account-search" size={64} color="#d1d5db" />
                <Text style={styles.noResultsTitle}>No users found</Text>
                <Text style={styles.noResultsText}>
                  Try searching with a different username or display name
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Suggestions de contenu
          <View style={styles.suggestions}>
            <Text style={styles.sectionTitle}>Recommended for you</Text>
            <FlatList
              data={mockSuggestions}
              renderItem={renderContentItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentList}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  searchResults: {
    flex: 1,
  },
  suggestions: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  userList: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDisplayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  userUsername: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  userFollowers: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#9147ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#f3f4f6',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#6b7280',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  contentList: {
    paddingHorizontal: 16,
  },
});

export default Search; 