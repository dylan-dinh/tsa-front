import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useClips } from '../hooks/useClips';

const { width, height } = Dimensions.get('window');

interface ClipEmbedProps {
  clipSlug: string;
  parentDomain: string;
  autoPlay?: boolean;
  muted?: boolean;
}

export function ClipEmbed({
  clipSlug,
  parentDomain,
  autoPlay = true,
  muted = true,
}: ClipEmbedProps) {
  const params = new URLSearchParams({
    clip: clipSlug,
    parent: parentDomain,
    autoplay: autoPlay ? 'true' : 'false',
    muted: muted ? 'true' : 'false',
  });

  return (
    <View style={{ width, height: height * 0.6 }}>
      <WebView
        source={{ uri: `https://clips.twitch.tv/embed?${params.toString()}` }}
        style={{ flex: 1, backgroundColor: 'black' }}
        scrollEnabled={false}
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        originWhitelist={['https://clips.twitch.tv']}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log('🔍 WebView trying to load:', url);
          
          // Only allow the main embed URL and block everything else
          if (url.includes('clips.twitch.tv/embed')) {
            console.log('✅ Allowed embed URL:', url);
            return true;
          }
          
          // Block everything else
          console.log('🚫 Blocked URL:', url);
          return false;
        }}
        onNavigationStateChange={(navState) => {
          console.log('📱 Navigation state changed:', navState.url);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('❌ WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('❌ WebView HTTP error: ', nativeEvent);
        }}
        // Additional settings to prevent external opening
        allowsLinkPreview={false}
        dataDetectorTypes="none"
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
        // Try to prevent external app opening
        onOpenWindow={(syntheticEvent) => {
          console.log('🚫 Blocked window open attempt');
          return false;
        }}
      />
    </View>
  );
}

interface ClipItemProps {
  clip: {
    id: number;
    title: string;
    broadcaster: string;
    views: string;
    clipId: string;
  };
  index: number;
  totalClips: number;
  onNext: () => void;
  onPrev: () => void;
}

function ClipItem({ clip, index, totalClips, onNext, onPrev }: ClipItemProps) {
  const [currentParentDomain, setCurrentParentDomain] = useState(0);
  
  const parentDomains = [
    'localhost',
    '127.0.0.1',
    'clipit.app',
    'example.com',
    'twitch.tv',
    'clips.twitch.tv',
    'www.twitch.tv',
    'player.twitch.tv'
  ];

  const handleRetry = () => {
    const nextDomain = (currentParentDomain + 1) % parentDomains.length;
    setCurrentParentDomain(nextDomain);
  };

  const handleOpenClip = () => {
    const clipUrl = `https://clips.twitch.tv/${clip.clipId}`;
    Alert.alert('Open Clip', `Would you like to open this clip in your browser?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open', onPress: () => console.log('Opening clip:', clipUrl) }
    ]);
  };

  return (
    <View style={styles.clipContainer}>
      <View style={styles.clipCounter}>
        <Text style={styles.counterText}>{index + 1} / {totalClips}</Text>
      </View>
      
              <ClipEmbed
          clipSlug={clip.clipId}
          parentDomain={parentDomains[currentParentDomain]}
          autoPlay={false}
          muted={false}
        />
      
      <View style={styles.clipInfo}>
        <Text style={styles.clipTitle}>{clip.title}</Text>
        <Text style={styles.clipBroadcaster}>@{clip.broadcaster}</Text>
        <Text style={styles.clipViews}>{clip.views} views</Text>
      </View>
      
      <View style={styles.clipActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleOpenClip}>
          <Text style={styles.actionBtnText}>🔗</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onNext}>
          <Text style={styles.actionBtnText}>⏭️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleRetry}>
          <Text style={styles.actionBtnText}>🔄</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.navigationHint}>
        <Text style={styles.hintText}>Swipe up/down to navigate</Text>
      </View>
    </View>
  );
}

export default function Explore() {
  const navigation = useNavigation();
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  
  // Mock clips data (replace with real backend data later)
  const mockClips = [
    {
      id: 1,
      title: 'Amazing Gaming Moment - Epic Play!',
      broadcaster: 'GamerPro',
      views: '15K',
      clipId: 'SuspiciousDifferentPanLitFam-mMLLjoIPEvQAgGya'
    },
    {
      id: 2,
      title: 'Epic Victory - Unbelievable Win!',
      broadcaster: 'StreamMaster',
      views: '25K',
      clipId: 'DreamyDiligentShieldAllenHuhu-arrh4IQrhKoG-KtX'
    },
    {
      id: 3,
      title: 'Incredible Team Fight',
      broadcaster: 'ProGamer',
      views: '32K',
      clipId: 'CrispyJazzyWrenMingLee-WJUOzWvessilciK5'
    },
    {
      id: 4,
      title: 'Perfect Strategy Execution',
      broadcaster: 'TacticalPlayer',
      views: '18K',
      clipId: 'SuspiciousDifferentPanLitFam-mMLLjoIPEvQAgGya'
    },
    {
      id: 5,
      title: 'Clutch Moment of the Year',
      broadcaster: 'ClutchKing',
      views: '45K',
      clipId: 'DreamyDiligentShieldAllenHuhu-arrh4IQrhKoG-KtX'
    }
  ];

  const handleNext = useCallback(() => {
    if (currentClipIndex < mockClips.length - 1) {
      setCurrentClipIndex(currentClipIndex + 1);
    }
  }, [currentClipIndex, mockClips.length]);

  const handlePrev = useCallback(() => {
    if (currentClipIndex > 0) {
      setCurrentClipIndex(currentClipIndex - 1);
    }
  }, [currentClipIndex]);

  const handleBack = () => {
    navigation.goBack();
  };

  if (mockClips.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explore Clips</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.noClips}>
          <Text style={styles.noClipsTitle}>No Clips Available</Text>
          <Text style={styles.noClipsText}>Check back later for new clips!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Clips</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const newIndex = Math.round(offsetY / height);
          if (newIndex !== currentClipIndex && newIndex >= 0 && newIndex < mockClips.length) {
            setCurrentClipIndex(newIndex);
          }
        }}
      >
        {mockClips.map((clip, index) => (
          <View key={clip.id} style={styles.clipPage}>
            <ClipItem
              clip={clip}
              index={index}
              totalClips={mockClips.length}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    height: 60,
    zIndex: 100,
  },
  backBtn: {
    padding: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    height: 5 * height, // 5 clips for now
  },
  clipPage: {
    height: height,
  },
  clipContainer: {
    flex: 1,
    position: 'relative',
  },
  clipCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
  },
  clipInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 12,
    zIndex: 10,
  },
  clipTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  clipBroadcaster: {
    color: '#9147ff',
    fontSize: 14,
    marginBottom: 4,
  },
  clipViews: {
    color: '#999',
    fontSize: 12,
  },
  clipActions: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    flexDirection: 'column',
    gap: 20,
    zIndex: 10,
  },
  actionBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 20,
  },
  navigationHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    zIndex: 20,
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
  },
  noClips: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noClipsTitle: {
    color: '#999',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  noClipsText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 