import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useClips } from '../hooks/useClips';
import { Clip } from '../types';
import ClipEmbed from './ClipEmbed';
import preferences, { Vote } from '../services/preferences';
import { getCategoryName } from '../data/categories';
import { colors, radii, font, fmtCount } from '../styles/theme';

export default function Explore() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth();
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);

  const paramGameId: string | undefined = route.params?.gameId;
  const paramClipId: string | undefined = route.params?.clipId;

  const [subscribed, setSubscribed] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [subs, v, s] = await Promise.all([
          preferences.getSubscribedGames(),
          preferences.getVotes(),
          preferences.getSavedClipIds(),
        ]);
        if (!active) return;
        setSubscribed(subs);
        setVotes(v);
        setSaved(Object.fromEntries(s.map((id) => [id, true])));
      })();
      return () => { active = false; };
    }, []),
  );

  const gameIds = paramGameId ? [paramGameId] : subscribed;
  const { clips, loading, loadingMore, hasMore, loadMore } = useClips({ gameIds, token: token || '' });

  // Jump to the tapped clip once data is in.
  useEffect(() => {
    if (paramClipId && clips.length) {
      const i = clips.findIndex((c) => String(c.ID) === paramClipId);
      if (i > 0) { setIndex(i); setTimeout(() => listRef.current?.scrollToIndex({ index: i, animated: false }), 60); }
    }
  }, [paramClipId, clips.length]);

  const pageH = height;
  const embedW = Math.min(width - (Platform.OS === 'web' ? 0 : 0), 720);
  const embedH = Math.round(embedW * 9 / 16);

  const onVote = async (clip: Clip, dir: 'up' | 'down') => {
    const id = String(clip.ID);
    const next: Vote = votes[id] === dir ? null : dir;
    setVotes((p) => ({ ...p, [id]: next }));
    await preferences.setVote(id, next);
  };
  const onSave = async (clip: Clip) => {
    const id = String(clip.ID);
    setSaved((p) => ({ ...p, [id]: !p[id] }));
    await preferences.toggleSavedClip(id);
  };

  const renderItem = ({ item, index: itemIndex }: { item: Clip; index: number }) => {
    const id = String(item.ID);
    const vote = votes[id];
    return (
      <View style={[styles.page, { height: pageH }]}>
        <View style={styles.embedHolder}>
          <ClipEmbed
            clip={item}
            width={embedW}
            height={embedH}
            isActive={itemIndex === index}
            preload={Math.abs(itemIndex - index) === 1}
          />
        </View>

        {/* Right action rail */}
        <View style={styles.rail}>
          <View style={styles.railItem}>
            <Pressable onPress={() => onVote(item, 'up')} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-up" size={34} color={vote === 'up' ? colors.electric : '#fff'} />
            </Pressable>
            <Text style={styles.railCount}>{fmtCount((item.ViewCount ? Math.round(item.ViewCount / 40) : 0) + (vote === 'up' ? 1 : vote === 'down' ? -1 : 0))}</Text>
            <Pressable onPress={() => onVote(item, 'down')} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-down" size={34} color={vote === 'down' ? colors.purple : 'rgba(255,255,255,0.55)'} />
            </Pressable>
          </View>
          <Pressable style={styles.railItem} onPress={() => onSave(item)} hitSlop={8}>
            <MaterialCommunityIcons name={saved[id] ? 'bookmark' : 'bookmark-outline'} size={28} color={saved[id] ? colors.electric : '#fff'} />
            <Text style={styles.railLabel}>Save</Text>
          </Pressable>
          <Pressable style={styles.railItem} hitSlop={8}>
            <MaterialCommunityIcons name="share-outline" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* Bottom info */}
        <View style={styles.info}>
          <View style={styles.catChip}>
            <Text style={styles.catChipText}>{getCategoryName(item.GameID)}</Text>
          </View>
          <Text style={styles.broadcaster}>{item.BroadcasterName || 'Twitch streamer'}</Text>
          <Text style={styles.clipTitle} numberOfLines={2}>{item.Title || 'Untitled clip'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{paramGameId ? getCategoryName(paramGameId) : 'Explore'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading && clips.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.purple} /></View>
      ) : clips.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="inbox-outline" size={42} color={colors.faint} />
          <Text style={styles.emptyText}>No clips to explore yet.</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={clips}
          keyExtractor={(c) => String(c.ID)}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={pageH}
          decelerationRate="fast"
          getItemLayout={(_, i) => ({ length: pageH, offset: pageH * i, index: i })}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.y / pageH))}
          onEndReachedThreshold={0.5}
          onEndReached={() => { if (hasMore && !loadingMore) loadMore(); }}
          onScrollToIndexFailed={() => {}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingTop: Platform.OS === 'web' ? 14 : 48, paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(5,5,9,0.5)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: font.weight.bold },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { color: colors.gray, fontSize: 14 },
  page: { width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  embedHolder: { justifyContent: 'center', alignItems: 'center' },
  rail: { position: 'absolute', right: 14, bottom: 120, alignItems: 'center', gap: 22 },
  railItem: { alignItems: 'center', gap: 3 },
  railCount: { color: '#fff', fontSize: 12, fontWeight: font.weight.bold, fontFamily: font.mono as any },
  railLabel: { color: '#fff', fontSize: 10, fontWeight: font.weight.semibold },
  info: { position: 'absolute', left: 16, right: 80, bottom: 60 },
  catChip: { alignSelf: 'flex-start', backgroundColor: 'rgba(5,5,9,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill, marginBottom: 9 },
  catChipText: { color: '#fff', fontSize: 11, fontWeight: font.weight.semibold },
  broadcaster: { color: '#fff', fontSize: 14, fontWeight: font.weight.bold, marginBottom: 5 },
  clipTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 19 },
  embedFallback: { justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: 16 },
  embedFallbackText: { color: colors.gray, fontSize: 13 },
});
