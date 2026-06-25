import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import ClipEmbed from './ClipEmbed';
import OrientationHint from './OrientationHint';
import { useAuth } from '../context/AuthContext';
import { useClips } from '../hooks/useClips';
import { Clip } from '../types';
import preferences, { Vote } from '../services/preferences';
import { colors, radii, font, fmtCount } from '../styles/theme';
import { getCategoryName } from '../data/categories';
import { SIDEBAR_WIDTH } from './AppNavBar';

type FeedTab = 'foryou' | 'trending' | 'following';

export default function Home() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const listRef = useRef<FlatList>(null);

  const [gameIds, setGameIds] = useState<string[]>([]);
  const [feedTab, setFeedTab] = useState<FeedTab>('foryou');
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

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
        setGameIds(subs);
        setVotes(v);
        setSaved(Object.fromEntries(s.map((id) => [id, true])));
      })();
      return () => { active = false; };
    }, []),
  );

  const { clips, loading, loadingMore, error, hasMore, loadMore, refresh } = useClips({
    gameIds,
    token: token || '',
  });

  const sorted = useMemo(() => {
    const list = [...clips];
    if (feedTab === 'trending') list.sort((a, b) => (b.ViewCount || 0) - (a.ViewCount || 0));
    else if (feedTab === 'following') list.sort((a, b) => (b.CreatedAt || '').localeCompare(a.CreatedAt || ''));
    return list;
  }, [clips, feedTab]);

  const pageH = height;
  const contentW = isDesktop ? width - SIDEBAR_WIDTH : width;
  const isLandscape = !isDesktop && width > height;

  // Clip dimensions:
  //   Landscape → height-driven 16:9 (fills the short axis)
  //   Portrait  → full width 16:9 + a bit more height for breathing room
  const TOP_CHROME = Platform.OS === 'web' ? 80 : isLandscape ? 0 : 100;
  const embedW = isLandscape
    ? Math.min(Math.round(height * 16 / 9), contentW)
    : contentW;
  const embedH = isLandscape
    ? height
    : Math.round(embedW * 9 / 16 * 1.15);

  const onVote = async (clip: Clip, dir: 'up' | 'down') => {
    const id = String(clip.ID);
    const next: Vote = votes[id] === dir ? null : dir;
    setVotes((p) => ({ ...p, [id]: next }));
    await preferences.setVote(id, next);
  };

  const onToggleSave = async (clip: Clip) => {
    const id = String(clip.ID);
    setSaved((p) => ({ ...p, [id]: !p[id] }));
    await preferences.toggleSavedClip(id);
  };

  const renderItem = ({ item, index }: { item: Clip; index: number }) => {
    const id = String(item.ID);
    const vote = votes[id] as Vote | undefined;
    const isActive = index === currentIndex;
    const baseVotes = item.ViewCount ? Math.round(item.ViewCount / 40) : 0;
    const voteDelta = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;

    return (
      <View style={[styles.page, { height: pageH }]}>
        {/* Embed centred in the page */}
        <View style={styles.embedHolder}>
          <ClipEmbed
            clip={item}
            width={embedW}
            height={embedH}
            isActive={isActive}
            preload={!isActive && Math.abs(index - currentIndex) === 1}
          />
        </View>

        {/* Right action rail */}
        <View style={styles.rail}>
          <View style={styles.railItem}>
            <Pressable onPress={() => onVote(item, 'up')} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-up" size={34} color={vote === 'up' ? colors.electric : '#fff'} />
            </Pressable>
            <Text style={styles.railCount}>{fmtCount(baseVotes + voteDelta)}</Text>
            <Pressable onPress={() => onVote(item, 'down')} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-down" size={34} color={vote === 'down' ? colors.purple : 'rgba(255,255,255,0.55)'} />
            </Pressable>
          </View>
          <Pressable style={styles.railItem} onPress={() => onToggleSave(item)} hitSlop={8}>
            <MaterialCommunityIcons
              name={saved[id] ? 'bookmark' : 'bookmark-outline'}
              size={28}
              color={saved[id] ? colors.electric : '#fff'}
            />
            <Text style={styles.railLabel}>Save</Text>
          </Pressable>
          <Pressable style={styles.railItem} hitSlop={8}>
            <MaterialCommunityIcons name="share-outline" size={28} color="#fff" />
          </Pressable>
        </View>

        {/* Bottom info overlay */}
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
    <View style={[styles.container, { paddingLeft: isDesktop ? SIDEBAR_WIDTH : 0 }]}>
      {/* Top header: logo + feed tabs — hidden in landscape (clip takes full screen) */}
      {!isLandscape && (
        <View style={styles.header} pointerEvents="box-none">
          {!isDesktop && (
            <View style={styles.logoRow}>
              <View style={styles.logoMark}>
                <MaterialCommunityIcons name="play" size={18} color="#fff" />
              </View>
              <Text style={styles.logoText}>ClipFlow</Text>
              <View style={{ flex: 1 }} />
              <Pressable style={styles.iconCircle} onPress={() => navigation.navigate('Discover')}>
                <MaterialCommunityIcons name="magnify" size={20} color={colors.gray} />
              </Pressable>
            </View>
          )}
          <View style={styles.tabsRow}>
            {(['foryou', 'trending', 'following'] as FeedTab[]).map((k) => {
              const labels: Record<FeedTab, string> = { foryou: 'For You', trending: 'Trending', following: 'Following' };
              const active = feedTab === k;
              return (
                <Pressable key={k} onPress={() => { setFeedTab(k); setCurrentIndex(0); listRef.current?.scrollToOffset({ offset: 0, animated: false }); }} style={styles.tab}>
                  <Text style={[styles.tabText, { color: active ? colors.white : 'rgba(255,255,255,0.5)', fontWeight: active ? font.weight.bold : font.weight.semibold }]}>
                    {labels[k]}
                  </Text>
                  {active && <View style={styles.tabIndicator} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {loading && sorted.length === 0 ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.purple} /></View>
      ) : sorted.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name={error ? 'alert-circle-outline' : 'inbox-outline'} size={42} color={colors.faint} />
          <Text style={styles.emptyTitle}>{error ? 'Could not load clips' : gameIds.length === 0 ? 'Your feed is empty' : 'No clips yet'}</Text>
          <Text style={styles.emptyText}>{error ? String(error) : 'Subscribe to categories to fill your feed.'}</Text>
          <Pressable style={styles.cta} onPress={() => (error ? refresh() : navigation.navigate('Discover'))}>
            <Text style={styles.ctaText}>{error ? 'Retry' : 'Browse categories'}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={sorted}
          keyExtractor={(c) => String(c.ID)}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={pageH}
          decelerationRate="fast"
          getItemLayout={(_, i) => ({ length: pageH, offset: pageH * i, index: i })}
          onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.y / pageH))}
          onEndReachedThreshold={0.5}
          onEndReached={() => { if (hasMore && !loadingMore) loadMore(); }}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.purple} style={{ marginVertical: 18 }} /> : null}
        />
      )}

      {/* Orientation hint — only renders on mobile portrait, fades in after clips load */}
      {Platform.OS !== 'web' && <OrientationHint />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    paddingTop: Platform.OS === 'web' ? 10 : 48,
  },
  logoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    paddingHorizontal: 16, marginBottom: 4,
  },
  logoMark: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center',
  },
  logoText: { fontSize: 19, fontWeight: font.weight.heavy, color: colors.white, letterSpacing: -0.4 },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(5,5,9,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  tab: { paddingHorizontal: 14, paddingVertical: 6, alignItems: 'center', gap: 4 },
  tabText: { fontSize: 15 },
  tabIndicator: {
    height: 2, width: '100%', backgroundColor: colors.white, borderRadius: 1,
  },
  embedHolder: { justifyContent: 'center', alignItems: 'center' },
  page: { width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  rail: { position: 'absolute', right: 14, bottom: 120, alignItems: 'center', gap: 22 },
  railItem: { alignItems: 'center', gap: 3 },
  railCount: { color: '#fff', fontSize: 12, fontWeight: font.weight.bold },
  railLabel: { color: '#fff', fontSize: 10, fontWeight: font.weight.semibold },
  info: { position: 'absolute', left: 16, right: 80, bottom: 60 },
  catChip: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(5,5,9,0.5)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill, marginBottom: 9,
  },
  catChipText: { color: '#fff', fontSize: 11, fontWeight: font.weight.semibold },
  broadcaster: { color: '#fff', fontSize: 14, fontWeight: font.weight.bold, marginBottom: 5 },
  clipTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 19 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: font.weight.bold, color: colors.white },
  emptyText: { marginTop: 6, fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 19 },
  cta: { marginTop: 16, backgroundColor: colors.purple, borderRadius: radii.md, paddingVertical: 11, paddingHorizontal: 20 },
  ctaText: { color: '#fff', fontSize: 13.5, fontWeight: font.weight.bold },
});
