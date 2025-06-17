import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Image, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from './GoogleIcon';
import { register } from '../services/api';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  displayName: Yup.string()
    .min(3, 'Display name must be at least 3 characters')
    .max(50, 'Display name must be less than 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Display name can only contain letters, numbers, hyphens, and underscores'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Invalid email format'
    ),
  age: Yup.number()
    .required('Age is required')
    .min(13, 'You must be at least 13 years old')
    .max(120, 'Please enter a valid age'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Composant Modal pour l'inscription
export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation<NavigationProp>();
  const { openLoginModal } = useModal();
  const { login } = useAuth();

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    try {
      // Map form values to API format
      const userData = {
        email: values.email,
        username: values.displayName || `user_${Date.now()}`, // Use display name as username if provided
        first_name: values.firstName,
        last_name: values.lastName,
        display_name: values.displayName,
        password: values.password,
      };

      const response = await register(userData);
      
      // For registration, we might not get a token back immediately due to email verification
      // Just show success and redirect to login
      Alert.alert('Success', 'Registration successful! Please check your email for verification.');
      onClose();
      openLoginModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await SecureStore.setItemAsync('userToken', 'google-oauth-token');
      navigation.navigate('Dashboard');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Google OAuth failed. Please try again.');
    }
  };

  const handleTwitchRegister = async () => {
    try {
      await SecureStore.setItemAsync('userToken', 'twitch-oauth-token');
      navigation.navigate('Dashboard');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Twitch OAuth failed. Please try again.');
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Content */}
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <Image
              source={require('../../assets/ClipIt_logo.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Headline */}
            <Text style={styles.headline}>Create your account</Text>

            {/* Progress Steps */}
            <View style={styles.stepsContainer}>
              {[1, 2, 3].map((step) => (
                <View key={step} style={styles.stepContainer}>
                  <View
                    style={[
                      styles.stepCircle,
                      currentStep >= step && styles.stepCircleActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumber,
                        currentStep >= step && styles.stepNumberActive,
                      ]}
                    >
                      {step}
                    </Text>
                  </View>
                  {step < 3 && (
                    <View
                      style={[
                        styles.stepLine,
                        currentStep > step && styles.stepLineActive,
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Social Sign Up Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleRegister}
              >
                <GoogleIcon size={22} />
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, styles.twitchButton]}
                onPress={handleTwitchRegister}
              >
                <MaterialCommunityIcons name="twitch" size={22} color="#9147ff" />
                <Text style={styles.twitchButtonText}>Sign up with Twitch</Text>
              </TouchableOpacity>
            </View>

            {/* OR Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Registration Form */}
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                displayName: '',
                email: '',
                age: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  {currentStep === 1 && (
                    <>
                      <Text style={styles.stepTitle}>Personal Information</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="First Name"
                          onChangeText={handleChange('firstName')}
                          onBlur={handleBlur('firstName')}
                          value={values.firstName}
                          placeholderTextColor="#9CA3AF"
                        />
                        {touched.firstName && errors.firstName && (
                          <Text style={styles.errorText}>{errors.firstName}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Last Name"
                          onChangeText={handleChange('lastName')}
                          onBlur={handleBlur('lastName')}
                          value={values.lastName}
                          placeholderTextColor="#9CA3AF"
                        />
                        {touched.lastName && errors.lastName && (
                          <Text style={styles.errorText}>{errors.lastName}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Display Name (Gamer Tag)"
                          onChangeText={handleChange('displayName')}
                          onBlur={handleBlur('displayName')}
                          value={values.displayName}
                          placeholderTextColor="#9CA3AF"
                        />
                        {touched.displayName && errors.displayName && (
                          <Text style={styles.errorText}>{errors.displayName}</Text>
                        )}
                        <Text style={styles.helpText}>This is how others will see you in the app</Text>
                      </View>

                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Age"
                          onChangeText={handleChange('age')}
                          onBlur={handleBlur('age')}
                          value={values.age}
                          keyboardType="numeric"
                          placeholderTextColor="#9CA3AF"
                        />
                        {touched.age && errors.age && (
                          <Text style={styles.errorText}>{errors.age}</Text>
                        )}
                      </View>

                      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                        <Text style={styles.nextButtonText}>Next</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <Text style={styles.stepTitle}>Account Details</Text>
                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Email"
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          value={values.email}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="#9CA3AF"
                        />
                        {touched.email && errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            style={[styles.input, styles.passwordInput]}
                            placeholder="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#9CA3AF"
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                          >
                            <MaterialCommunityIcons
                              name={showPassword ? 'eye-off' : 'eye'}
                              size={24}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && (
                          <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            style={[styles.input, styles.passwordInput]}
                            placeholder="Confirm Password"
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholderTextColor="#9CA3AF"
                          />
                          <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <MaterialCommunityIcons
                              name={showConfirmPassword ? 'eye-off' : 'eye'}
                              size={24}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                          <Text style={styles.prevButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                          <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <Text style={styles.stepTitle}>Review & Submit</Text>
                      <View style={styles.reviewContainer}>
                        <View style={styles.reviewItem}>
                          <Text style={styles.reviewLabel}>Name:</Text>
                          <Text style={styles.reviewValue}>
                            {values.firstName} {values.lastName}
                          </Text>
                        </View>
                        <View style={styles.reviewItem}>
                          <Text style={styles.reviewLabel}>Display Name:</Text>
                          <Text style={styles.reviewValue}>{values.displayName}</Text>
                        </View>
                        <View style={styles.reviewItem}>
                          <Text style={styles.reviewLabel}>Age:</Text>
                          <Text style={styles.reviewValue}>{values.age}</Text>
                        </View>
                        <View style={styles.reviewItem}>
                          <Text style={styles.reviewLabel}>Email:</Text>
                          <Text style={styles.reviewValue}>{values.email}</Text>
                        </View>
                      </View>

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                          <Text style={styles.prevButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.submitButton, isLoading && styles.buttonDisabled]}
                          onPress={() => handleSubmit()}
                          disabled={isLoading}
                        >
                          <Text style={styles.submitButtonText}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
            </Formik>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  openLoginModal();
                }}
              >
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Composant Screen pour la navigation
export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { isRegisterModalOpen, closeRegisterModal } = useModal();

  return (
    <RegisterModal 
      isOpen={isRegisterModalOpen} 
      onClose={closeRegisterModal}
    />
  );
}

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
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 16,
    alignSelf: 'center',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#9147ff',
  },
  stepNumber: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
  },
  stepLineActive: {
    backgroundColor: '#9147ff',
  },
  socialButtons: {
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleButton: {
    backgroundColor: 'white',
  },
  twitchButton: {
    backgroundColor: 'white',
  },
  googleButtonText: {
    color: '#000',
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
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
  },
  eyeIcon: {
    padding: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  prevButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  nextButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#9147ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  prevButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#9147ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewLabel: {
    width: 80,
    color: '#6B7280',
    fontSize: 14,
  },
  reviewValue: {
    flex: 1,
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#9147ff',
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
});
