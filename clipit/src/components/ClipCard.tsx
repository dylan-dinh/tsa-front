import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Clip } from '../types';

interface ClipCardProps {
  clip: Clip;
  onClick?: (clip: Clip) => void;
}

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ClipCard: React.FC<ClipCardProps> = ({ clip, onClick }) => {

  const formatDuration = (duration: number | undefined): string => {
    if (!duration || duration === 0) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (views: number | undefined): string => {
    if (!views || views === 0) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handlePress = () => {
    if (onClick) {
      onClick(clip);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.thumbnail}>
        {clip.thumbnail_url && (
          <Image 
            source={{ uri: clip.thumbnail_url }} 
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.duration}>
            <Text style={styles.durationText}>
              {formatDuration(clip.duration)}
            </Text>
          </View>
          <View style={styles.playButton}>
            <Text style={styles.playButtonText}>▶</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {clip.title || 'Untitled Clip'}
        </Text>
        
        <View style={styles.meta}>
          <Text style={styles.creator}>
            by {clip.creator_name || 'Unknown'}
          </Text>
          <Text style={styles.views}>
            {formatViewCount(clip.view_count)} views
          </Text>
        </View>
        
        {clip.broadcaster_name && (
          <View style={styles.broadcaster}>
            <Text style={styles.broadcasterName}>
              {clip.broadcaster_name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    overflow: 'hidden',
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    height: isWeb ? 200 : 160,
    backgroundColor: '#f8f9fa',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    opacity: 0,
  },
  duration: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    color: '#9147ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creator: {
    fontSize: 14,
    color: '#9147ff',
    fontWeight: '500',
  },
  views: {
    fontSize: 14,
    color: '#6c757d',
  },
  broadcaster: {
    marginTop: 4,
  },
  broadcasterName: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
});

export default ClipCard; 