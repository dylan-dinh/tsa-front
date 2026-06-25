import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, font, shadow } from '../styles/theme';

const ICONS: Record<string, { on: string; off: string }> = {
  Home: { on: 'home', off: 'home-outline' },
  Discover: { on: 'compass', off: 'compass-outline' },
  Saved: { on: 'bookmark', off: 'bookmark-outline' },
  Profile: { on: 'account', off: 'account-outline' },
};

// Responsive tab bar: left sidebar on desktop, bottom bar on mobile.
// Used as the `tabBar` of a bottom-tab navigator, so screens stay mounted
// (Twitch clip embeds keep playing) while the user moves between tabs.
export default function AppNavBar({ state, navigation }: BottomTabBarProps) {
  const { width, height } = useWindowDimensions();
  const isDesktop = width >= 1024;
  // Hide the bottom bar when the phone is in landscape so clips can fill the screen
  const isLandscape = !isDesktop && width > height;

  const onPress = (routeName: string, index: number, isFocused: boolean) => {
    const event = navigation.emit({ type: 'tabPress', target: state.routes[index].key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName as never);
  };

  if (isLandscape) return null;

  if (isDesktop) {
    return (
      <View style={styles.sidebar}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="play" size={22} color="#fff" />
          </View>
          <Text style={styles.logoText}>ClipFlow</Text>
        </View>
        <View style={styles.sideItems}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const ic = ICONS[route.name] || ICONS.Home;
            return (
              <Pressable
                key={route.key}
                style={[styles.sideItem, focused && styles.sideItemActive]}
                onPress={() => onPress(route.name, index, focused)}
              >
                <MaterialCommunityIcons name={(focused ? ic.on : ic.off) as any} size={24} color={focused ? colors.white : colors.dim} />
                <Text style={[styles.sideLabel, { color: focused ? colors.white : colors.dim }]}>{route.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bottomBar}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const ic = ICONS[route.name] || ICONS.Home;
        return (
          <Pressable key={route.key} style={styles.bottomItem} onPress={() => onPress(route.name, index, focused)}>
            <MaterialCommunityIcons name={(focused ? ic.on : ic.off) as any} size={24} color={focused ? colors.white : colors.dim} />
            <Text style={[styles.bottomLabel, { color: focused ? colors.white : colors.dim }]}>{route.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const SIDEBAR_WIDTH = 240;

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
    paddingVertical: 24,
    paddingHorizontal: 16,
    ...(Platform.OS === 'web' ? { position: 'fixed' as any, left: 0, top: 0, bottom: 0 } : {}),
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 8, marginBottom: 28 },
  logoMark: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center', ...shadow(1) },
  logoText: { fontSize: 22, fontWeight: font.weight.heavy, color: colors.white, letterSpacing: -0.5 },
  sideItems: { gap: 4 },
  sideItem: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.md },
  sideItemActive: { backgroundColor: colors.card },
  sideLabel: { fontSize: 15, fontWeight: font.weight.semibold },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(8,8,14,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  bottomItem: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6 },
  bottomLabel: { fontSize: 10, fontWeight: font.weight.semibold },
});
