import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  timestamp: string;
  likes: number;
  views: number;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  author,
  timestamp,
  likes,
  views,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {/* Image Section */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <MaterialCommunityIcons name="play" size={24} color="white" />
          </View>
        </View>
      )}

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        {/* Author and Timestamp */}
        <View style={styles.metaInfo}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="eye" size={16} color="#666" />
            <Text style={styles.statText}>{views.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="heart" size={16} color="#666" />
            <Text style={styles.statText}>{likes.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="share-variant" size={16} color="#666" />
            <Text style={styles.statText}>Share</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9147ff',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
}); 