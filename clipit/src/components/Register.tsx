import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, Image, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useModal } from '../context/ModalContext';
import GoogleIcon from './GoogleIcon';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
}

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
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

const Register: React.FC<RegisterProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation<NavigationProp>();
  const { openLoginModal } = useModal();

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    try {
      // Here you would implement the actual registration logic
      // For now, we'll simulate a successful registration
      await SecureStore.setItemAsync('userToken', 'dummy-token');
      navigation.navigate('Dashboard');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                        />
                        {touched.lastName && errors.lastName && (
                          <Text style={styles.errorText}>{errors.lastName}</Text>
                        )}
                      </View>

                      <View style={styles.inputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Age"
                          onChangeText={handleChange('age')}
                          onBlur={handleBlur('age')}
                          value={values.age}
                          keyboardType="numeric"
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
                        />
                        {touched.email && errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </View>

                      <View style={styles.stepButtons}>
                        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                          <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                          <Text style={styles.nextButtonText}>Next</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <Text style={styles.stepTitle}>Create Password</Text>
                      <View style={styles.inputContainer}>
                        <View style={styles.passwordContainer}>
                          <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={!showPassword}
                          />
                          <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.passwordToggle}
                          >
                            <MaterialCommunityIcons
                              name={showPassword ? 'eye-off' : 'eye'}
                              size={20}
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
                            style={styles.passwordInput}
                            placeholder="Confirm Password"
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                            secureTextEntry={!showConfirmPassword}
                          />
                          <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.passwordToggle}
                          >
                            <MaterialCommunityIcons
                              name={showConfirmPassword ? 'eye-off' : 'eye'}
                              size={20}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                      </View>

                      <View style={styles.stepButtons}>
                        <TouchableOpacity style={styles.backButton} onPress={prevStep}>
                          <Text style={styles.backButtonText}>Back</Text>
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
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  content: {
    marginTop: 16,
  },
  logo: {
    height: 48,
    width: 'auto',
    alignSelf: 'center',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 16,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
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
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#9147ff',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verificationStep: {
    alignItems: 'center',
    marginTop: 16,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  verificationText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signInLink: {
    color: '#9147ff',
    fontSize: 14,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: '#9147ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
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
  submitButton: {
    backgroundColor: '#9147ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Register;
