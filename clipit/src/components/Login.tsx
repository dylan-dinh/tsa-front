import React, { useState, Suspense } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useModal } from '../context/ModalContext';

const FcGoogle = React.lazy(() =>
  import('react-icons/fc').then(module => ({ default: module.FcGoogle as React.ComponentType<any> }))
);

type RootStackParamList = {
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { openRegisterModal } = useModal();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Here you would implement the actual login logic
      // For now, we'll simulate a successful login
      await SecureStore.setItemAsync('userToken', 'dummy-token');
      navigation.navigate('Dashboard');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            {/* Logo */}
            <Image
              source={require('../../assets/ClipIt_logo.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Headline */}
            <Text style={styles.headline}>Connect to Clip</Text>

            {/* Social Sign Up Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => {/* TODO: Implement Google OAuth */}}
              >
                <Suspense fallback={null}>
                  <FcGoogle size={22} />
                </Suspense>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.twitchButton]}
                onPress={() => {/* TODO: Implement Twitch OAuth */}}
              >
                <MaterialCommunityIcons name="twitch" size={22} color="#9147ff" />
                <Text style={styles.twitchButtonText}>Sign in with Twitch</Text>
              </TouchableOpacity>
            </View>

            {/* OR Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Email Form */}
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.buttonDisabled]}
                    onPress={() => handleSubmit()}
                    disabled={isLoading}
                  >
                    <Text style={styles.submitButtonText}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => {/* TODO: Implement forgot password */}}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Not registered yet? </Text>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  openRegisterModal();
                }}
              >
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    height: 48,
    width: 'auto',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 16,
  },
  socialButtons: {
    width: '100%',
    gap: 16,
    marginTop: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  twitchButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  twitchButtonText: {
    color: '#9147ff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#9147ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signUpText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signUpLink: {
    color: '#9147ff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Login;
