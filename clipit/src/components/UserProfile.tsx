import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Image, StyleSheet, useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Screen from './Screen';
import { useAuth } from '../context/AuthContext';
import { getUser } from '../services/api';
import preferences from '../services/preferences';
import { CATEGORIES } from '../data/categories';
import { colors, radii, font } from '../styles/theme';

export default function UserProfile() {
  const navigation = useNavigation<any>();
  const { user, token, logout, updateUser } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [savedCount, setSavedCount] = useState(0);
  const [upCount, setUpCount] = useState(0);
  const [subs, setSubs] = useState<string[]>([]);
  const [tab, setTab] = useState<'saved' | 'upvoted'>('saved');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [saved, votes, s] = await Promise.all([
          preferences.getSavedClipIds(),
          preferences.getVotes(),
          preferences.getSubscribedGames(),
        ]);
        if (!active) return;
        setSavedCount(saved.length);
        setUpCount(Object.values(votes).filter((v) => v === 'up').length);
        setSubs(s);
        // Refresh user from backend if we have a token.
        if (token) {
          try {
            const res = await getUser(token);
            if (active && res?.data) updateUser(res.data);
          } catch { /* keep cached user */ }
        }
      })();
      return () => { active = false; };
    }, [token]),
  );

  const name = user?.display_name || user?.username || user?.login || 'ClipFlow User';
  const handle = '@' + (user?.login || user?.twitch_username || user?.username || 'user');
  const avatar = user?.twitch_avatar;
  const favCats = CATEGORIES.filter((c) => subs.includes(c.game_id));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerRow, isMobile && { flexDirection: 'column', alignItems: 'center' }]}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitials}>{name.slice(0, 2).toUpperCase()}</Text>
            </View>
          )}
          <View style={[styles.headerInfo, isMobile && { alignItems: 'center', marginTop: 14 }]}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.handle}>{handle}</Text>
          </View>
          <Pressable style={styles.logoutBtn} onPress={() => { logout(); navigation.navigate('Landing'); }}>
            <MaterialCommunityIcons name="logout" size={16} color={colors.gray} />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        <View style={styles.stats}>
          <Stat n={savedCount} label="Saved" />
          <Stat n={upCount} label="Upvoted" />
          <Stat n={favCats.length} label="Following" />
        </View>

        <Text style={styles.sectionLabel}>Favorite categories</Text>
        {favCats.length === 0 ? (
          <Text style={styles.muted}>No categories yet — subscribe in Discover.</Text>
        ) : (
          <View style={styles.chips}>
            {favCats.map((c) => (
              <Pressable key={c.game_id} style={styles.chip} onPress={() => navigation.navigate('Explore', { gameId: c.game_id })}>
                <View style={[styles.chipDot, { backgroundColor: `hsl(${c.hue} 70% 64%)` }]} />
                <Text style={styles.chipText}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.tabs}>
          {(['saved', 'upvoted'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
              <Text style={[styles.tabText, { color: tab === t ? colors.white : colors.dim }]}>{t === 'saved' ? 'Saved' : 'Upvoted'}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.viewBtn} onPress={() => navigation.navigate('Saved')}>
          <MaterialCommunityIcons name="bookmark-multiple-outline" size={18} color={colors.electric} />
          <Text style={styles.viewBtnText}>Open your saved clips</Text>
        </Pressable>
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNum}>{n}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  avatarFallback: { backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { color: '#fff', fontSize: 22, fontWeight: font.weight.heavy },
  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: font.weight.heavy, color: colors.white, letterSpacing: -0.3 },
  handle: { fontSize: 13, color: colors.gray, marginTop: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, borderRadius: radii.pill, paddingHorizontal: 13, paddingVertical: 8 },
  logoutText: { fontSize: 12.5, fontWeight: font.weight.bold, color: colors.gray },
  stats: { flexDirection: 'row', gap: 10, marginTop: 18 },
  stat: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.lg, paddingVertical: 14, alignItems: 'center' },
  statNum: { fontSize: 19, fontWeight: font.weight.heavy, color: colors.white, fontFamily: font.mono as any },
  statLabel: { fontSize: 11, color: colors.gray, marginTop: 3 },
  sectionLabel: { fontSize: 12, fontWeight: font.weight.bold, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.dim, marginTop: 22, marginBottom: 10 },
  muted: { fontSize: 13, color: colors.gray },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: 12.5, fontWeight: font.weight.semibold, color: colors.white },
  tabs: { flexDirection: 'row', gap: 22, marginTop: 24, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  tab: { paddingBottom: 9, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.electric },
  tabText: { fontSize: 14, fontWeight: font.weight.bold },
  viewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.md, paddingVertical: 13 },
  viewBtnText: { fontSize: 13.5, fontWeight: font.weight.bold, color: colors.electric },
});
