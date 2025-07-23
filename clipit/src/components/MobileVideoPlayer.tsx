import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clip } from '../types';

interface MobileVideoPlayerProps {
  clip: Clip;
  isActive: boolean;
  onClipClick?: (clip: Clip) => void;
}

const { width, height } = Dimensions.get('window');
const VIDEO_WIDTH = Math.min(width * 0.9, 600);
const VIDEO_HEIGHT = Math.min(height * 0.8, VIDEO_WIDTH * (16 / 9));

const MobileVideoPlayer: React.FC<MobileVideoPlayerProps> = ({ clip, isActive, onClipClick }) => {
  const formatDuration = (duration: number | undefined): string => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    // For mobile, we'll show clip info and open the clip URL
    console.log('Mobile clip tapped:', clip.TwitchID);
    console.log('Clip URL:', clip.URL);
    console.log('Embed URL:', clip.EmbedURL);
    
    // Show clip info to user
    alert(`Clip: ${clip.Title || 'Untitled'}\nBroadcaster: ${clip.BroadcasterName}\nViews: ${clip.ViewCount?.toLocaleString()}\n\nURL: ${clip.URL}\n\nThis would open the video player in a future update.`);
    
    // Also call the original onClipClick for any existing functionality
    onClipClick?.(clip);
  };

  // Show thumbnail with play button
  return (
    <TouchableOpacity 
      onPress={handlePlayPause} 
      activeOpacity={0.9} 
      style={styles.thumbnailContainer}
    >
      {clip.ThumbnailURL ? (
        <Image 
          source={{ uri: clip.ThumbnailURL }} 
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderThumbnail}>
          <MaterialCommunityIcons name="video" size={48} color="#dbdbdb" />
        </View>
      )}
      
      {/* Duration Badge */}
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{formatDuration(clip.Duration)}</Text>
      </View>

      {/* Play Button Overlay */}
      <View style={styles.playButtonOverlay}>
        <MaterialCommunityIcons name="play-circle" size={64} color="#ffffff" />
      </View>
      
      {/* Mobile-specific overlay text */}
      <View style={styles.mobileOverlay}>
        <Text style={styles.mobileOverlayText}>Tap to play</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    position: 'relative',
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  mobileOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  mobileOverlayText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MobileVideoPlayer; 