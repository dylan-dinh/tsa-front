import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Clip } from '../types';

interface VideoPlayerProps {
  clip: Clip;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ clip, onClose }) => {
  console.log('VideoPlayer: Rendering clip:', {
    title: clip.title,
    url: clip.url,
    embed_url: clip.embed_url,
    thumbnail_url: clip.thumbnail_url
  });

  if (Platform.OS === 'web') {
    // For web, use an iframe to embed the Twitch clip
    let embedUrl = clip.embed_url || clip.url;
    
    // If we have a regular Twitch clip URL, convert it to embed URL
    if (embedUrl && embedUrl.includes('clips.twitch.tv') && !embedUrl.includes('/embed/')) {
      const clipId = embedUrl.split('/').pop()?.split('?')[0];
      if (clipId) {
        embedUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=localhost`;
      }
    }
    
    console.log('VideoPlayer: Using embed URL:', embedUrl);
    
    if (!embedUrl) {
      console.log('VideoPlayer: No embed URL available');
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <p style={styles.errorText}>No video URL available</p>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={{
            border: 'none',
            width: '100%',
            height: '100%'
          }}
        />
      </View>
    );
  }

  // For mobile, we'll need to implement native video player
  // For now, show a placeholder
  return (
    <View style={styles.container}>
      <View style={styles.mobilePlaceholder}>
        <p style={styles.mobileText}>Video player for mobile coming soon</p>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#6c757d',
    fontSize: 16,
  },
  mobilePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileText: {
    color: '#6c757d',
    fontSize: 16,
  },
});

export default VideoPlayer; 