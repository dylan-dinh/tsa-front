import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ContentItem } from '../services/contentService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Catégories gaming uniquement
const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'grid', color: '#9147ff' },
  { id: 'fps', name: 'FPS', icon: 'target', color: '#ef4444' },
  { id: 'moba', name: 'MOBA', icon: 'sword-cross', color: '#8b5cf6' },
  { id: 'battle-royale', name: 'Battle Royale', icon: 'crown', color: '#f59e0b' },
  { id: 'esport', name: 'Esport', icon: 'trophy', color: '#06b6d4' },
  { id: 'rpg', name: 'RPG', icon: 'shield-sword', color: '#10b981' },
  { id: 'speedrun', name: 'Speedrun', icon: 'run-fast', color: '#3b82f6' },
];

// Mock de contenu gaming sans images/vidéos en dur
const mockExploreContent: ContentItem[] = [
  {
    id: 'e1',
    title: 'Insane 1v5 Clutch on Dust2',
    description: 'Unbelievable CS:GO clutch in a tournament match!',
    imageUrl: undefined,
    author: 'ProGamer123',
    timestamp: '1 hour ago',
    likes: 15420,
    views: 234500,
    category: 'fps',
    duration: '2:15'
  },
  {
    id: 'e2',
    title: 'Pentakill in Ranked Game',
    description: 'Epic pentakill in League of Legends!',
    imageUrl: undefined,
    author: 'MobaMaster',
    timestamp: '3 hours ago',
    likes: 8920,
    views: 156700,
    category: 'moba',
    duration: '1:42'
  },
  {
    id: 'e3',
    title: 'Victory Royale with 1 HP',
    description: 'Last second win in Fortnite Battle Royale!',
    imageUrl: undefined,
    author: 'BRKing',
    timestamp: '5 hours ago',
    likes: 12340,
    views: 189200,
    category: 'battle-royale',
    duration: '3:28'
  },
  {
    id: 'e4',
    title: 'Esport Finals Best Moments',
    description: 'Top plays from the latest esport finals.',
    imageUrl: undefined,
    author: 'EsportFan',
    timestamp: '1 day ago',
    likes: 5670,
    views: 89000,
    category: 'esport',
    duration: '4:45'
  },
  {
    id: 'e5',
    title: 'World Record Speedrun',
    description: 'New world record on Super Mario 64!',
    imageUrl: undefined,
    author: 'SpeedRunner',
    timestamp: '2 days ago',
    likes: 9870,
    views: 145600,
    category: 'speedrun',
    duration: '8:20'
  },
  {
    id: 'e6',
    title: 'Epic RPG Boss Fight',
    description: 'Defeating the hardest boss in Elden Ring.',
    imageUrl: undefined,
    author: 'RPGHero',
    timestamp: '3 days ago',
    likes: 11230,
    views: 178900,
    category: 'rpg',
    duration: '6:15'
  }
];

const Explore = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState<ContentItem[]>(mockExploreContent);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;

  // Filtrer le contenu par catégorie
  const filteredContent = selectedCategory === 'all' 
    ? content 
    : content.filter(item => item.category === selectedCategory);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleContentPress = (item: ContentItem) => {
    console.log('Open content:', item.title);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <MaterialCommunityIcons 
        name={item.icon as any} 
        size={20} 
        color={selectedCategory === item.id ? '#ffffff' : item.color} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderContentItem = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity 
      style={styles.contentItem}
      onPress={() => handleContentPress(item)}
    >
      <View style={styles.placeholderClip}>
        <MaterialCommunityIcons name="gamepad-variant" size={48} color="#9147ff" />
      </View>
      <View style={styles.contentOverlay}>
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.contentAuthor}>{item.author}</Text>
          <View style={styles.contentStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="eye" size={12} color="#ffffff" />
              <Text style={styles.statText}>{item.views.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="heart" size={12} color="#ffffff" />
              <Text style={styles.statText}>{item.likes.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec titre */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover the best gaming clips</Text>
      </View>

      {/* Filtres par catégorie */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Grille de contenu */}
      <FlatList
        data={filteredContent}
        renderItem={renderContentItem}
        keyExtractor={(item) => item.id}
        numColumns={isMobile ? 2 : 3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentGrid}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#9147ff']}
            tintColor="#9147ff"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="compass" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No clips found</Text>
            <Text style={styles.emptyText}>
              Try selecting a different category
            </Text>
          </View>
        }
      />
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  categoryItemActive: {
    backgroundColor: '#9147ff',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  contentGrid: {
    padding: 8,
  },
  contentItem: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  placeholderClip: {
    width: '100%',
    aspectRatio: 3/4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
  },
  contentOverlay: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 16,
  },
  contentAuthor: {
    fontSize: 10,
    color: '#9147ff',
    marginBottom: 6,
  },
  contentStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 10,
    color: '#9147ff',
    marginLeft: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Explore; 