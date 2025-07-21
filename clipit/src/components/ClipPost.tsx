import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clip } from '../types';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ClipPostProps {
  clip: Clip;
  onClick?: (clip: Clip) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  shouldPreload?: boolean;
}

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Calculate optimal dimensions for the video container
const VIDEO_ASPECT_RATIO = 16 / 9;
const VIDEO_WIDTH = Math.min(width * 0.5, 600); // 50% of width or max 600px
const VIDEO_HEIGHT = Math.min(height * 0.75, VIDEO_WIDTH * VIDEO_ASPECT_RATIO);

const ClipPost: React.FC<ClipPostProps> = ({ clip, onClick, onVisibilityChange, shouldPreload = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '-40% 0px -40% 0px'
  });

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isIntersecting);
    }

    // Handle pause when not in view
    if (iframeRef.current && hasLoaded) {
      if (!isIntersecting) {
        // Pause video when not in view - use timeout to ensure it works
        setTimeout(() => {
          if (iframeRef.current && !isIntersecting) {
            const pauseMessage = JSON.stringify({ eventName: 'pause' });
            iframeRef.current.contentWindow?.postMessage(pauseMessage, '*');
            setIsPlaying(false);
          }
        }, 100);
      } else {
        setIsPlaying(true);
      }
    }
  }, [isIntersecting, onVisibilityChange, hasLoaded]);

  // Preload video when shouldPreload is true
  useEffect(() => {
    if (shouldPreload && !hasLoaded && Platform.OS === 'web' && clip.EmbedURL) {
      const preloadIframe = document.createElement('iframe');
      preloadIframe.style.display = 'none';
      preloadIframe.src = `${clip.EmbedURL}&parent=localhost&autoplay=false&muted=true`;
      
      preloadIframe.onload = () => {
        setHasLoaded(true);
        document.body.removeChild(preloadIframe);
      };
      
      document.body.appendChild(preloadIframe);
    }
  }, [shouldPreload, clip.EmbedURL, hasLoaded]);

  // Memoize the iframe src to prevent constant re-renders
  const iframeSrc = useMemo(() => {
    if (!clip.EmbedURL) return '';
    // Enable autoplay for better user experience
    return `${clip.EmbedURL}&parent=localhost&autoplay=true&muted=true`;
  }, [clip.EmbedURL]);

  const handlePress = () => {
    if (Platform.OS === 'web' && clip.EmbedURL && isIntersecting) {
      // If video is visible, handle click
      if (onClick) {
        onClick(clip);
      }
    } else if (onClick) {
      onClick(clip);
    }
  };

  const formatDuration = (duration: number | undefined): string => {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (views: number | undefined): string => {
    if (!views) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <View style={styles.post} ref={elementRef}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=1' }} 
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{clip.BroadcasterName || 'Unknown'}</Text>
        </View>
      </View>

      {/* Video Content */}
      <View style={[styles.videoContainer, { width: VIDEO_WIDTH, height: VIDEO_HEIGHT }]}>
        {(Platform.OS === 'web' && clip.EmbedURL && (isIntersecting || hasLoaded || shouldPreload)) ? (
          <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.videoWrapper}>
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{
                border: 'none',
                borderRadius: 8,
                backgroundColor: '#000',
              }}
              onLoad={() => {
                setHasLoaded(true);
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.thumbnailContainer}>
            {clip.ThumbnailURL ? (
              <Image 
                source={{ uri: clip.ThumbnailURL }} 
                style={styles.videoThumbnail as any}
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
          </TouchableOpacity>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="heart-outline" size={28} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.viewCount}>{formatViewCount(clip.ViewCount)} views</Text>
        <Text style={styles.title}>{clip.Title || 'Untitled Clip'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
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
    alignItems: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: VIDEO_WIDTH,
    alignSelf: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
  },
  timestamp: {
    fontSize: 12,
    color: '#8e8e93',
  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
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
    borderRadius: 8,
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
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: VIDEO_WIDTH,
    alignSelf: 'center',
  },
  actionButton: {
    marginRight: 16,
  },
  postInfo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignSelf: 'center',
    width: VIDEO_WIDTH,
  },
  viewCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default ClipPost; 