import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Image, FlatList } from 'react-native';
import { useInView } from 'react-intersection-observer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clip } from '../types';

interface VideoFeedProps {
  clips: Clip[];
  onClipClick?: (clip: Clip) => void;
  onEndReached?: () => void;
}

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Calculate optimal dimensions for the video container
const VIDEO_ASPECT_RATIO = 16 / 9;
const VIDEO_WIDTH = Math.min(width * 0.9, 600); // 90% of width or max 600px
const VIDEO_HEIGHT = Math.min(height * 0.8, VIDEO_WIDTH * VIDEO_ASPECT_RATIO);

interface VideoItemProps {
  clip: Clip;
  index: number;
  isActive: boolean;
  onClipClick?: (clip: Clip) => void;
}

const VideoItem: React.FC<VideoItemProps> = React.memo(({ clip, index, isActive, onClipClick }) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Handle play/pause based on active state using postMessage (no reloading)
  useEffect(() => {
    if (Platform.OS === 'web' && iframeRef.current && hasLoaded) {
      // Small delay to ensure iframe is ready
      const timeoutId = setTimeout(() => {
        if (isActive) {
          console.log(`Playing clip: ${clip.Title || clip.TwitchID}`);
          // Try multiple postMessage methods for reliability
          try {
            const playMessage = JSON.stringify({ eventName: 'play' });
            iframeRef.current?.contentWindow?.postMessage(playMessage, '*');
            
            // Fallback: try different message format
            setTimeout(() => {
              iframeRef.current?.contentWindow?.postMessage('play', '*');
            }, 50);
          } catch (error) {
            console.error('Error playing clip:', error);
          }
        } else {
          console.log(`Pausing clip: ${clip.Title || clip.TwitchID}`);
          // Try multiple postMessage methods for reliability
          try {
            const pauseMessage = JSON.stringify({ eventName: 'pause' });
            iframeRef.current?.contentWindow?.postMessage(pauseMessage, '*');
            
            // Fallback: try different message format
            setTimeout(() => {
              iframeRef.current?.contentWindow?.postMessage('pause', '*');
            }, 50);
          } catch (error) {
            console.error('Error pausing clip:', error);
          }
        }
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isActive, hasLoaded, clip.Title, clip.TwitchID]);

  return (
    <View style={styles.clipContainer}>
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
        {Platform.OS === 'web' && clip.EmbedURL ? (
          <View style={styles.videoWrapper}>
            <iframe
              ref={iframeRef}
              key={`iframe-${clip.TwitchID}`}
              src={`${clip.EmbedURL}&parent=localhost&autoplay=false&muted=true&preload=metadata&controls=true`}
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
                console.log(`Iframe loaded for clip: ${clip.Title || clip.TwitchID}`);
                setHasLoaded(true);
              }}
            />
          </View>
        ) : (
          <TouchableOpacity 
            onPress={() => onClipClick?.(clip)} 
            activeOpacity={0.9} 
            style={styles.thumbnailContainer}
          >
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

            {/* Play Button Overlay for Mobile */}
            {!isWeb && (
              <View style={styles.playButtonOverlay}>
                <MaterialCommunityIcons name="play-circle" size={64} color="#ffffff" />
              </View>
            )}
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
});

const VideoFeed: React.FC<VideoFeedProps> = ({ clips, onClipClick, onEndReached }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Preload first clip and next clip
  useEffect(() => {
    if (clips.length > 0) {
      console.log('Preloading first clip and next clip');
      // First clip is already being rendered
      // Next clip will be preloaded by FlatList
    }
  }, [clips]);

  const renderClipItem = useCallback(({ item, index }: { item: Clip; index: number }) => {
    const clip = item;
    const isActive = index === activeIndex;
    
    return (
      <VideoItem
        clip={clip}
        index={index}
        isActive={isActive}
        onClipClick={onClipClick}
      />
    );
  }, [activeIndex, onClipClick]);

  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newActiveIndex = viewableItems[0].index;
      setActiveIndex(newActiveIndex);
      console.log(`Active clip: ${clips[newActiveIndex]?.Title || clips[newActiveIndex]?.TwitchID}`);
      
      // Trigger load more when near the end
      if (newActiveIndex >= clips.length - 3 && onEndReached) {
        onEndReached();
      }
    }
  }, [clips, onEndReached]);

  if (clips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No clips available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={clips}
        renderItem={renderClipItem}
        keyExtractor={(item, index) => `clip-${index}`}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
          minimumViewTime: 100,
        }}
        removeClippedSubviews={false}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flatList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  clipContainer: {
    height: height,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
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
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
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

export default VideoFeed; 