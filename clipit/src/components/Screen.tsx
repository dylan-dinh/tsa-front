import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { colors } from '../styles/theme';
import { SIDEBAR_WIDTH } from './AppNavBar';

// Wraps a screen with the ClipFlow dark background and, on desktop, offsets
// content past the fixed sidebar. Children handle their own scrolling.
export default function Screen({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingLeft: isDesktop ? SIDEBAR_WIDTH : 0 }}>
      {children}
    </View>
  );
}
