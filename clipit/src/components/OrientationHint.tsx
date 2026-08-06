import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated,
  useWindowDimensions, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { colors, radii, font } from '../styles/theme';

/**
 * Renders two things:
 *  - Portrait mode  → a bottom banner "Flip for a better view" + Rotate button
 *  - Landscape mode → a small floating button to return to portrait
 *
 * Lock/unlock strategy:
 *  • "Rotate" button   → lockAsync(LANDSCAPE) so UI flips even if device stays portrait
 *  • Physical rotation → we listen for orientation events even while locked;
 *                        when the device goes back to portrait we auto-unlock.
 *  • "Back" button     → lockAsync(PORTRAIT_UP) then immediately unlock (free rotation)
 */
export default function OrientationHint() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [dismissed, setDismissed] = useState(false);
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  // Track whether WE issued a lock (so we know to release it)
  const isLockedByUs = useRef(false);

  // ── Fade portrait banner in/out ────────────────────────────────────────────
  useEffect(() => {
    if (!isLandscape && !dismissed) {
      Animated.timing(bannerOpacity, {
        toValue: 1, duration: 350, delay: 900, useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(bannerOpacity, {
        toValue: 0, duration: 180, useNativeDriver: true,
      }).start();
    }
    // Re-arm the banner when returning to portrait
    if (!isLandscape) setDismissed(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLandscape]);

  // ── Listen for physical device orientation ─────────────────────────────────
  // expo-screen-orientation fires this listener even while locked, which lets
  // us detect when the user physically rotates back to portrait and auto-unlock.
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const sub = ScreenOrientation.addOrientationChangeListener((evt) => {
      const o = evt.orientationInfo.orientation;
      const physicallyPortrait =
        o === ScreenOrientation.Orientation.PORTRAIT_UP ||
        o === ScreenOrientation.Orientation.PORTRAIT_DOWN;

      if (physicallyPortrait && isLockedByUs.current) {
        isLockedByUs.current = false;
        ScreenOrientation.unlockAsync().catch(() => {});
      }
    });

    return () => sub.remove();
  }, []);

  // ── Release lock on unmount (navigating away) ──────────────────────────────
  useEffect(() => {
    return () => {
      if (Platform.OS !== 'web' && isLockedByUs.current) {
        isLockedByUs.current = false;
        ScreenOrientation.unlockAsync().catch(() => {});
      }
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleRotate = async () => {
    setDismissed(true);
    try {
      isLockedByUs.current = true;
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } catch {
      isLockedByUs.current = false;
    }
  };

  const handleBackToPortrait = async () => {
    try {
      isLockedByUs.current = true;
      // Lock to portrait first (forces the UI to snap back)
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      // Then immediately unlock so normal auto-rotation is re-enabled
      isLockedByUs.current = false;
      await ScreenOrientation.unlockAsync();
    } catch {
      isLockedByUs.current = false;
    }
  };

  if (Platform.OS === 'web') return null;

  return (
    <>
      {/* ── Portrait banner ─────────────────────────────────────────────── */}
      {!isLandscape && !dismissed && (
        <Animated.View style={[styles.banner, { opacity: bannerOpacity }]}
          pointerEvents="box-none">
          <MaterialCommunityIcons
            name="phone-rotate-landscape" size={22} color={colors.purple} />
          <Text style={styles.bannerText} numberOfLines={1}>
            Flip for a better view
          </Text>
          <View style={styles.actions}>
            <Pressable style={styles.rotateBtn} onPress={handleRotate} hitSlop={8}>
              <Text style={styles.rotateTxt}>Rotate</Text>
            </Pressable>
            <Pressable onPress={() => setDismissed(true)} hitSlop={10}
              style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={16}
                color="rgba(255,255,255,0.45)" />
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* ── Landscape: back-to-portrait button (top-right corner) ─────── */}
      {isLandscape && (
        <Pressable style={styles.backBtn} onPress={handleBackToPortrait}
          hitSlop={12}>
          <MaterialCommunityIcons
            name="phone-rotate-portrait" size={22} color="#fff" />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(12,8,24,0.93)',
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(145,70,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 60,
  },
  bannerText: {
    flex: 1,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: font.weight.semibold,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rotateBtn: {
    backgroundColor: colors.purple,
    borderRadius: radii.sm,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  rotateTxt: { color: '#fff', fontSize: 12, fontWeight: font.weight.bold },
  closeBtn: { padding: 4 },
  backBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 60,
    backgroundColor: 'rgba(12,8,24,0.7)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
