import React, { useCallback, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Screen from './Screen';
import { CATEGORIES, Category, gradientFor } from '../data/categories';
import preferences from '../services/preferences';
import { useAuth } from '../context/AuthContext';
import { colors, radii, font } from '../styles/theme';

export default function Discover() {
  const navigation = useNavigation<any>();
  const { token } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const [subs, setSubs] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      // If logged in, pull the authoritative list from the backend and sync
      // local storage; otherwise fall back to the local-only list.
      const load = token
        ? preferences.syncSubscriptionsFromBackend()
        : preferences.getSubscribedGames();
      load.then((s) => { if (active) setSubs(s); });
      return () => { active = false; };
    }, [token]),
  );

  const toggle = async (gameId: string) => {
    const cat = CATEGORIES.find((c) => c.game_id === gameId);
    const next = await preferences.toggleSubscribedGame(gameId, {
      name: cat?.name,
      box_art_url: undefined,
    });
    setSubs(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)) : CATEGORIES;
  }, [query]);

  const yourCats = CATEGORIES.filter((c) => subs.includes(c.game_id));

  const gradStyle = (c: Category) =>
    Platform.OS === 'web' ? ({ backgroundImage: gradientFor(c.hue) } as any) : { backgroundColor: `hsl(${c.hue} 50% 20%)` };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Discover</Text>

        <View style={styles.search}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.dim} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search games, categories"
            placeholderTextColor={colors.dim}
            style={styles.searchInput}
          />
        </View>

        {yourCats.length > 0 && query === '' && (
          <>
            <Text style={styles.sectionLabel}>Your categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9, paddingBottom: 4 }}>
              {yourCats.map((c) => (
                <Pressable key={c.game_id} style={[styles.yourCard, gradStyle(c)]} onPress={() => navigation.navigate('Explore', { gameId: c.game_id })}>
                  <View style={styles.yourCardOverlay} />
                  <Text style={styles.yourCardText} numberOfLines={2}>{c.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.sectionLabel}>Browse all</Text>
        <View style={[styles.grid, isDesktop && styles.gridDesktop]}>
          {filtered.map((c) => {
            const on = subs.includes(c.game_id);
            return (
              <View key={c.game_id} style={[styles.row, isDesktop && styles.rowDesktop]}>
                <Pressable style={styles.rowMain} onPress={() => navigation.navigate('Explore', { gameId: c.game_id })}>
                  <View style={[styles.rowArt, gradStyle(c)]} />
                  <Text style={styles.rowName} numberOfLines={1}>{c.name}</Text>
                </Pressable>
                <Pressable
                  style={[styles.subBtn, on ? styles.subBtnOn : styles.subBtnOff]}
                  onPress={() => toggle(c.game_id)}
                >
                  <MaterialCommunityIcons name={on ? 'check' : 'plus'} size={16} color={on ? colors.electric : colors.white} />
                  <Text style={[styles.subBtnText, { color: on ? colors.electric : colors.white }]}>{on ? 'Subscribed' : 'Subscribe'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 },
  title: { fontSize: 26, fontWeight: font.weight.heavy, color: colors.white, letterSpacing: -0.5 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.md, paddingHorizontal: 13, paddingVertical: Platform.OS === 'web' ? 11 : 9,
  },
  searchInput: { flex: 1, color: colors.white, fontSize: 14, ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}) },
  sectionLabel: { fontSize: 12, fontWeight: font.weight.bold, letterSpacing: 0.6, textTransform: 'uppercase', color: colors.dim, marginTop: 22, marginBottom: 11 },
  yourCard: { width: 124, height: 76, borderRadius: radii.lg, padding: 10, justifyContent: 'flex-end', overflow: 'hidden' },
  yourCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,5,9,0.32)' },
  yourCardText: { fontSize: 12.5, fontWeight: font.weight.bold, color: '#fff' },
  grid: { gap: 9 },
  gridDesktop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.lg, padding: 10,
  },
  rowDesktop: { width: '49%' },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowArt: { width: 46, height: 46, borderRadius: 12 },
  rowName: { flex: 1, fontSize: 14, fontWeight: font.weight.bold, color: colors.white },
  subBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radii.pill, paddingHorizontal: 13, paddingVertical: 7, borderWidth: 1 },
  subBtnOn: { backgroundColor: colors.purpleSoft, borderColor: 'rgba(176,103,255,0.4)' },
  subBtnOff: { backgroundColor: colors.surface, borderColor: 'rgba(255,255,255,0.1)' },
  subBtnText: { fontSize: 12, fontWeight: font.weight.bold },
});
