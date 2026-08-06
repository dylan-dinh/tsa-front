import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginModal } from './Login';
import { RegisterModal } from './Register';
import OAuthCallback from './OAuthCallback';
import GoogleIcon from './GoogleIcon';
import { useModal } from '../context/ModalContext';
import { initiateTwitchAuth } from '../services/api';
import { colors, radii, font, shadow, gradients } from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

const brandGrad = Platform.OS === 'web' ? ({ backgroundImage: gradients.brandCss } as any) : { backgroundColor: colors.purple };

const LandingPage = () => {
  // Detect Twitch OAuth redirect (?code / ?token) before rendering the page.
  const showCallback = Platform.OS === 'web' && (() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('code') !== null || p.get('token') !== null ||
      window.location.pathname.includes('callback') || window.location.href.includes('code=');
  })();
  if (showCallback) return <OAuthCallback />;

  const navigation = useNavigation<NavigationProp>();
  const { isLoginModalOpen, isRegisterModalOpen, openLoginModal, openRegisterModal, closeLoginModal, closeRegisterModal } = useModal();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const handleTwitch = useCallback(() => {
    if (Platform.OS === 'web') window.location.href = initiateTwitchAuth();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.inner, { maxWidth: isDesktop ? 460 : 420 }]}>
        <View style={styles.hero}>
          <View style={[styles.logoMark, brandGrad]}>
            <MaterialCommunityIcons name="play" size={44} color="#fff" />
          </View>
          <Text style={styles.wordmark}>ClipFlow</Text>
          <Text style={styles.tagline}>The best moments from Twitch, in one endless feed.</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, brandGrad, shadow(1)]} onPress={handleTwitch}>
            <MaterialCommunityIcons name="twitch" size={20} color="#fff" />
            <Text style={styles.btnTextPrimary}>Continue with Twitch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={openLoginModal}>
            <GoogleIcon size={20} />
            <Text style={styles.btnTextGhost}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.sep}>
            <View style={styles.sepLine} />
            <Text style={styles.sepText}>OR</Text>
            <View style={styles.sepLine} />
          </View>

          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={openLoginModal}>
            <Text style={styles.btnTextGhost}>Log in with email</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>New to ClipFlow?</Text>
            <TouchableOpacity onPress={openRegisterModal}>
              <Text style={styles.signupLink}>Create account</Text>
            </TouchableOpacity>
          </View>

          {/* Dev shortcut — app is open in dev mode */}
          <TouchableOpacity style={styles.devLink} onPress={() => navigation.navigate('Main' as never)}>
            <Text style={styles.devLinkText}>Skip → enter app (dev)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />}
      {isRegisterModalOpen && <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />}
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', padding: 24 },
  inner: { width: '100%' },
  hero: { alignItems: 'center', marginBottom: 40 },
  logoMark: { width: 76, height: 76, borderRadius: 23, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  wordmark: { fontSize: 31, fontWeight: font.weight.heavy, color: colors.white, letterSpacing: -0.6 },
  tagline: { marginTop: 9, fontSize: 14.5, color: colors.gray, textAlign: 'center', lineHeight: 21, maxWidth: 260 },
  actions: { width: '100%' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: 15, marginBottom: 11 },
  btnGhost: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.hairline },
  btnTextPrimary: { color: '#fff', fontSize: 15, fontWeight: font.weight.bold },
  btnTextGhost: { color: colors.white, fontSize: 15, fontWeight: font.weight.semibold },
  sep: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 6 },
  sepLine: { flex: 1, height: 1, backgroundColor: colors.hairline },
  sepText: { fontSize: 11, fontWeight: font.weight.semibold, color: colors.dim },
  signupRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  signupText: { fontSize: 13.5, color: colors.gray },
  signupLink: { fontSize: 13.5, color: colors.electric, fontWeight: font.weight.bold },
  devLink: { marginTop: 24, alignItems: 'center' },
  devLinkText: { fontSize: 12, color: colors.dim, fontWeight: font.weight.semibold },
});
