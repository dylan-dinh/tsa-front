import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Clip } from '../types';
import ClipItem from './ClipItem';

interface SnapCarouselFeedProps {
  clips: Clip[];
  onClipClick?: (clip: Clip) => void;
  onEndReached?: () => void;
}

const { height } = Dimensions.get('window');

const SnapCarouselFeed: React.FC<SnapCarouselFeedProps> = ({ 
  clips, 
  onClipClick, 
  onEndReached 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);


  const renderClipItem = useCallback(({ item, index }: { item: Clip; index: number }) => {
    const clip = item;
    const isActive = index === activeIndex;
    
    return (
      <ClipItem
        clip={clip}
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
          itemVisiblePercentThreshold: 60,
          minimumViewTime: 50,
        }}
        removeClippedSubviews={false}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
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
});

export default SnapCarouselFeed; 