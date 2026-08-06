import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Platform,
  KeyboardAvoidingView, ScrollView, ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, initiateTwitchAuth } from '../services/api';
import GoogleIcon from './GoogleIcon';
import { colors, radii, font, gradients } from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LoginModalProps { isOpen: boolean; onClose: () => void; }

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const brandGrad = Platform.OS === 'web' ? ({ backgroundImage: gradients.brandCss } as any) : { backgroundColor: colors.purple };

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { openRegisterModal } = useModal();
  const { login: authLogin } = useAuth();

  // Real backend login: POST /api/users/login -> { token, user }
  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const data = await apiLogin(values.email, values.password);
      await authLogin(data.token, data.user);
      onClose();
      navigation.navigate('Main' as never);
    } catch (e: any) {
      setServerError(e?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitch = () => {
    if (Platform.OS === 'web') window.location.href = initiateTwitchAuth();
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <TouchableOpacity onPress={onClose} style={styles.close}>
              <MaterialCommunityIcons name="close" size={22} color={colors.gray} />
            </TouchableOpacity>

            <View style={[styles.logoMark, brandGrad]}>
              <MaterialCommunityIcons name="play" size={28} color="#fff" />
            </View>
            <Text style={styles.headline}>Welcome back</Text>

            <TouchableOpacity style={[styles.social, brandGrad]} onPress={handleTwitch}>
              <MaterialCommunityIcons name="twitch" size={20} color="#fff" />
              <Text style={styles.socialTextPrimary}>Sign in with Twitch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.social, styles.socialGhost]} onPress={openRegisterModal}>
              <GoogleIcon size={20} />
              <Text style={styles.socialTextGhost}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.sep}>
              <View style={styles.sepLine} /><Text style={styles.sepText}>OR</Text><View style={styles.sepLine} />
            </View>

            <Formik initialValues={{ email: '', password: '' }} validationSchema={loginSchema} onSubmit={handleLogin}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={{ width: '100%' }}>
                  <TextInput
                    style={styles.input} placeholder="Email" placeholderTextColor={colors.dim}
                    onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email}
                    keyboardType="email-address" autoCapitalize="none"
                  />
                  {touched.email && errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}
                  <TextInput
                    style={styles.input} placeholder="Password" placeholderTextColor={colors.dim}
                    onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} secureTextEntry
                  />
                  {touched.password && errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
                  {serverError ? <Text style={styles.err}>{serverError}</Text> : null}

                  <TouchableOpacity style={[styles.submit, brandGrad, isLoading && { opacity: 0.7 }]} onPress={() => handleSubmit()} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Log in</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Not registered? </Text>
              <TouchableOpacity onPress={() => { onClose(); openRegisterModal(); }}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function LoginScreen() {
  const { isLoginModalOpen, closeLoginModal } = useModal();
  return <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.hairline, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' },
  close: { position: 'absolute', top: 14, right: 14, zIndex: 1, padding: 4 },
  logoMark: { width: 56, height: 56, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  headline: { fontSize: 22, fontWeight: font.weight.heavy, color: colors.white, marginBottom: 22 },
  social: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingVertical: 13, borderRadius: 13, marginBottom: 10 },
  socialGhost: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.hairline },
  socialTextPrimary: { color: '#fff', fontSize: 15, fontWeight: font.weight.bold },
  socialTextGhost: { color: colors.white, fontSize: 15, fontWeight: font.weight.semibold },
  sep: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', marginVertical: 14 },
  sepLine: { flex: 1, height: 1, backgroundColor: colors.hairline },
  sepText: { fontSize: 11, color: colors.dim, fontWeight: font.weight.semibold },
  input: { width: '100%', height: 48, borderWidth: 1, borderColor: colors.hairline, borderRadius: 12, paddingHorizontal: 15, fontSize: 15, color: colors.white, backgroundColor: colors.card, marginBottom: 10, ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}) },
  err: { color: colors.danger, fontSize: 12, marginBottom: 8, alignSelf: 'flex-start' },
  submit: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: font.weight.bold },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signupText: { color: colors.gray, fontSize: 13.5 },
  signupLink: { color: colors.electric, fontSize: 13.5, fontWeight: font.weight.bold },
});
