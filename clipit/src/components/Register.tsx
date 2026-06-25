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
import { register as apiRegister, login as apiLogin } from '../services/api';
import { colors, font, gradients } from '../styles/theme';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
interface RegisterModalProps { isOpen: boolean; onClose: () => void; }

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().min(3, 'Min 3 characters').required('Username is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const brandGrad = Platform.OS === 'web' ? ({ backgroundImage: gradients.brandCss } as any) : { backgroundColor: colors.purple };

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const { openLoginModal } = useModal();
  const { login: authLogin } = useAuth();

  // POST /api/users/register, then sign the user straight in.
  const handleRegister = async (values: { email: string; username: string; password: string; display_name?: string }) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await apiRegister(values);
      try {
        const data = await apiLogin(values.email, values.password);
        await authLogin(data.token, data.user);
        onClose();
        navigation.navigate('Main' as never);
      } catch {
        // Account created but auto-login blocked (e.g. email verification) — send to login.
        onClose();
        openLoginModal();
      }
    } catch (e: any) {
      setServerError(e?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.headline}>Create your account</Text>

            <Formik
              initialValues={{ email: '', username: '', password: '', display_name: '' }}
              validationSchema={schema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={{ width: '100%' }}>
                  <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.dim} keyboardType="email-address" autoCapitalize="none" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
                  {touched.email && errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}
                  <TextInput style={styles.input} placeholder="Username" placeholderTextColor={colors.dim} autoCapitalize="none" onChangeText={handleChange('username')} onBlur={handleBlur('username')} value={values.username} />
                  {touched.username && errors.username ? <Text style={styles.err}>{errors.username}</Text> : null}
                  <TextInput style={styles.input} placeholder="Display name (optional)" placeholderTextColor={colors.dim} onChangeText={handleChange('display_name')} onBlur={handleBlur('display_name')} value={values.display_name} />
                  <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.dim} secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
                  {touched.password && errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
                  {serverError ? <Text style={styles.err}>{serverError}</Text> : null}
                  <TouchableOpacity style={[styles.submit, brandGrad, isLoading && { opacity: 0.7 }]} onPress={() => handleSubmit()} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Create account</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <View style={styles.row}>
              <Text style={styles.rowText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => { onClose(); openLoginModal(); }}>
                <Text style={styles.rowLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function RegisterScreen() {
  const { isRegisterModalOpen, closeRegisterModal } = useModal();
  return <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.hairline, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center' },
  close: { position: 'absolute', top: 14, right: 14, zIndex: 1, padding: 4 },
  logoMark: { width: 56, height: 56, borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 12 },
  headline: { fontSize: 22, fontWeight: font.weight.heavy, color: colors.white, marginBottom: 20 },
  input: { width: '100%', height: 48, borderWidth: 1, borderColor: colors.hairline, borderRadius: 12, paddingHorizontal: 15, fontSize: 15, color: colors.white, backgroundColor: colors.card, marginBottom: 10, ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}) },
  err: { color: colors.danger, fontSize: 12, marginBottom: 8, alignSelf: 'flex-start' },
  submit: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: font.weight.bold },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  rowText: { color: colors.gray, fontSize: 13.5 },
  rowLink: { color: colors.electric, fontSize: 13.5, fontWeight: font.weight.bold },
});
