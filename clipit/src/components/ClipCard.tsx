import React, { memo } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clip } from '../types';
import { colors, radii, font, fmtCount, fmtDuration } from '../styles/theme';
import { getCategoryName, getCategoryHue, gradientFor } from '../data/categories';

export type VoteState = 'up' | 'down' | null;

interface ClipCardProps {
  clip: Clip;
  vote?: VoteState;
  saved?: boolean;
  onVote?: (dir: 'up' | 'down') => void;
  onToggleSave?: () => void;
  onShare?: () => void;
  onOpen?: () => void;          // tap thumbnail -> open clip / play
  onOpenTwitch?: () => void;    // "Twitch" pill -> open original
}

// Twitch thumbnail URLs come templated (e.g. ..._preview-%{width}x%{height}.jpg)
const normalizeThumb = (url?: string): string | undefined =>
  url
    ?.replace(/%?\{width\}/g, '480')
    .replace(/%?\{height\}/g, '272');

const initials = (name?: string) =>
  (name || 'TW').replace('@', '').slice(0, 2).toUpperCase();

function ClipCardImpl({
  clip,
  vote = null,
  saved = false,
  onVote,
  onToggleSave,
  onShare,
  onOpen,
  onOpenTwitch,
}: ClipCardProps) {
  const hue = getCategoryHue(clip.GameID);
  const thumb = normalizeThumb(clip.ThumbnailURL);
  const placeholder = Platform.OS === 'web' ? ({ backgroundImage: gradientFor(hue) } as any) : { backgroundColor: `hsl(${hue} 50% 18%)` };
  const baseVotes = clip.ViewCount ? Math.round(clip.ViewCount / 40) : 0;
  const voteDelta = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;

  return (
    <View style={styles.card}>
      {/* Thumbnail */}
      <Pressable style={styles.thumbWrap} onPress={onOpen}>
        <View style={[styles.thumb, placeholder]}>
          {thumb ? (
            <Image source={{ uri: thumb }} style={styles.thumbImg} resizeMode="cover" />
          ) : null}
        </View>
        <View style={styles.playBtn}>
          <MaterialCommunityIcons name="play" size={28} color="#fff" />
        </View>
        <View style={styles.catChip}>
          <View style={[styles.dot, { backgroundColor: `hsl(${hue} 70% 64%)` }]} />
          <Text style={styles.catChipText} numberOfLines={1}>{getCategoryName(clip.GameID)}</Text>
        </View>
        {clip.Duration ? (
          <View style={styles.durChip}>
            <Text style={styles.durText}>{fmtDuration(clip.Duration)}</Text>
          </View>
        ) : null}
        <View style={styles.viewsChip}>
          <MaterialCommunityIcons name="eye" size={14} color={colors.white} />
          <Text style={styles.viewsText}>{fmtCount(clip.ViewCount)}</Text>
        </View>
      </Pressable>

      {/* Meta */}
      <View style={styles.body}>
        <View style={styles.streamerRow}>
          <View style={[styles.avatar, { backgroundColor: `hsl(${hue} 60% 45%)` }]}>
            <Text style={styles.avatarText}>{initials(clip.BroadcasterName)}</Text>
          </View>
          <Text style={styles.streamerName} numberOfLines={1}>
            {clip.BroadcasterName || 'Twitch streamer'}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{clip.Title || 'Untitled clip'}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.votePill}>
            <Pressable onPress={() => onVote?.('up')} hitSlop={6} style={styles.voteBtn}>
              <MaterialCommunityIcons name="chevron-up" size={22} color={vote === 'up' ? colors.electric : colors.dim} />
            </Pressable>
            <Text style={styles.voteCount}>{fmtCount(baseVotes + voteDelta)}</Text>
            <Pressable onPress={() => onVote?.('down')} hitSlop={6} style={styles.voteBtn}>
              <MaterialCommunityIcons name="chevron-down" size={22} color={vote === 'down' ? colors.purple : colors.dim} />
            </Pressable>
          </View>

          <Pressable style={styles.pillBtn} onPress={onShare}>
            <MaterialCommunityIcons name="comment-outline" size={17} color={colors.gray} />
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable style={styles.iconBtn} onPress={onToggleSave} hitSlop={6}>
            <MaterialCommunityIcons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={19}
              color={saved ? colors.electric : colors.gray}
            />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={onShare} hitSlop={6}>
            <MaterialCommunityIcons name="share-outline" size={19} color={colors.gray} />
          </Pressable>
          <Pressable style={styles.twitchPill} onPress={onOpenTwitch}>
            <MaterialCommunityIcons name="open-in-new" size={15} color={colors.electric} />
            <Text style={styles.twitchPillText}>Twitch</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export const ClipCard = memo(ClipCardImpl);
export default ClipCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  thumbWrap: { width: '100%', aspectRatio: 16 / 9, position: 'relative' },
  thumb: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  thumbImg: { width: '100%', height: '100%' },
  playBtn: {
    position: 'absolute', top: '50%', left: '50%',
    width: 54, height: 54, marginLeft: -27, marginTop: -27,
    borderRadius: 27, backgroundColor: 'rgba(8,8,14,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center', alignItems: 'center',
  },
  catChip: {
    position: 'absolute', left: 10, top: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill,
    backgroundColor: 'rgba(5,5,9,0.55)', maxWidth: '70%',
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  catChipText: { fontSize: 11.5, fontWeight: font.weight.semibold, color: colors.white },
  durChip: {
    position: 'absolute', right: 10, bottom: 10,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7,
    backgroundColor: 'rgba(5,5,9,0.72)',
  },
  durText: { fontFamily: font.mono as any, fontSize: 11, color: colors.white },
  viewsChip: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewsText: { fontSize: 12, fontWeight: font.weight.semibold, color: colors.white },
  body: { padding: 14 },
  streamerRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  avatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 11, fontWeight: font.weight.bold, color: '#fff' },
  streamerName: { fontSize: 13, fontWeight: font.weight.semibold, color: colors.white, flexShrink: 1 },
  title: { marginTop: 9, fontSize: 15, fontWeight: font.weight.semibold, color: colors.white, lineHeight: 20 },
  actions: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  votePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.pill, paddingHorizontal: 4,
  },
  voteBtn: { paddingVertical: 6, paddingHorizontal: 5 },
  voteCount: { minWidth: 30, textAlign: 'center', fontSize: 12, fontWeight: font.weight.bold, color: colors.white, fontFamily: font.mono as any },
  pillBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 8,
  },
  iconBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  twitchPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, height: 34, paddingHorizontal: 12,
    borderRadius: radii.pill, backgroundColor: colors.purpleSoft,
  },
  twitchPillText: { fontSize: 12, fontWeight: font.weight.bold, color: colors.electric },
});
