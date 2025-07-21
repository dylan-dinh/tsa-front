import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import ClipPost from './ClipPost';
import { Clip } from '../types';

interface ClipFeedProps {
  clips: Clip[];
  onLoadMore?: () => void;
}

const PRELOAD_BUFFER = 2; // Number of clips to preload in each direction

const ClipFeed: React.FC<ClipFeedProps> = ({ clips, onLoadMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add smooth scroll behavior using CSS
      const style = document.createElement('style');
      style.textContent = `
        .clip-feed-scroll {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          height: 100vh;
          -webkit-overflow-scrolling: touch;
        }
        .clip-item {
          scroll-snap-align: center;
          scroll-snap-stop: always;
        }
      `;
      document.head.appendChild(style);
      
      if (scrollViewRef.current) {
        const element = scrollViewRef.current as unknown as HTMLElement;
        element.classList.add('clip-feed-scroll');

        // Add clip-item class to all clip containers
        const clipContainers = element.getElementsByClassName('clip-container');
        Array.from(clipContainers).forEach(container => {
          container.classList.add('clip-item');
        });
      }

      // No longer relying on visibleClips state; preloading handled by index comparison
    }

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [clips]);

  const handleScroll = (event: any) => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const viewportHeight = layoutMeasurement.height;
    
    // Calculate current index based on scroll position
    const newIndex = Math.round(scrollPosition / viewportHeight);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      
      // nothing else needed since shouldPreload derived from index difference
    }

    // Check if we're near the bottom to trigger load more
    if (scrollPosition + viewportHeight >= contentSize.height - viewportHeight) {
      onLoadMore?.();
    }

    // Snap to the nearest clip after scrolling stops
    scrollTimeout.current = setTimeout(() => {
      if (scrollViewRef.current) {
        const targetY = Math.round(scrollPosition / viewportHeight) * viewportHeight;
        scrollViewRef.current.scrollTo({ y: targetY, animated: true });
      }
    }, 50);
  };

  // No-op placeholder for future visibility tracking if needed
  const handleClipVisibilityChange = () => {};

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={Dimensions.get('window').height}
      snapToAlignment="center"
    >
      {clips.map((clip, idx) => (
        <View 
          key={clip.ID} 
          style={styles.clipContainer}
          testID="clip-container"
        >
          <ClipPost
            clip={clip}
            isActive={currentIndex === idx}
            shouldPreload={Math.abs(idx - currentIndex) <= PRELOAD_BUFFER}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flexGrow: 1,
  },
  clipContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
  }
});

export default ClipFeed; 