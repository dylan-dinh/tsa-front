import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Screen from './Screen';
import ClipCard, { VoteState } from './ClipCard';
import clipsStorage from '../services/clipsStorage';
import preferences, { Vote } from '../services/preferences';
import { Clip } from '../types';
import { colors, font } from '../styles/theme';

export default function SavedClips() {
  const navigation = useNavigation<any>();
  const [clips, setClips] = useState<Clip[]>([]);
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const [savedIds, cached, v] = await Promise.all([
          preferences.getSavedClipIds(),
          clipsStorage.getClips(),
          preferences.getVotes(),
        ]);
        if (!active) return;
        const set = new Set(savedIds);
        setClips(cached.filter((c) => set.has(String(c.ID))));
        setVotes(v);
      })();
      return () => { active = false; };
    }, []),
  );

  const onVote = async (clip: Clip, dir: 'up' | 'down') => {
    const id = String(clip.ID);
    const next: Vote = votes[id] === dir ? null : dir;
    setVotes((p) => ({ ...p, [id]: next }));
    await preferences.setVote(id, next);
  };
  const onUnsave = async (clip: Clip) => {
    const id = String(clip.ID);
    setClips((p) => p.filter((c) => String(c.ID) !== id));
    await preferences.toggleSavedClip(id);
  };

  return (
    <Screen>
      <FlatList
        data={clips}
        keyExtractor={(c) => String(c.ID)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Saved</Text>
            <Text style={styles.sub}>{clips.length} clip{clips.length === 1 ? '' : 's'}</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bookmark-outline" size={42} color={colors.faint} />
            <Text style={styles.emptyTitle}>No saved clips</Text>
            <Text style={styles.emptyText}>Tap the bookmark on any clip to keep it here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 14 }}>
            <ClipCard
              clip={item}
              saved
              vote={(votes[String(item.ID)] as VoteState) ?? null}
              onVote={(d) => onVote(item, d)}
              onToggleSave={() => onUnsave(item)}
              onOpen={() => navigation.navigate('Explore', { clipId: String(item.ID) })}
              onOpenTwitch={() => navigation.navigate('Explore', { clipId: String(item.ID) })}
            />
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: font.weight.heavy, color: colors.white, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: colors.gray, marginTop: 4, marginBottom: 14 },
  empty: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 24 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: font.weight.bold, color: colors.white },
  emptyText: { marginTop: 6, fontSize: 13, color: colors.gray, textAlign: 'center', lineHeight: 19 },
});
