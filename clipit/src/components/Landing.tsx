// Requirements to run this component:
// npm install @expo/vector-icons react-icons
//test git status

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, SafeAreaView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginModal } from './Login';
import { RegisterModal } from './Register';
import SocialAuth from './SocialAuth';
import GoogleIcon from './GoogleIcon';
import { useModal } from '../context/ModalContext';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialAuthProps extends ModalProps {
  provider: 'google' | 'twitch';
}

const LandingPage = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isLoginModalOpen, isRegisterModalOpen, openLoginModal, openRegisterModal, closeLoginModal, closeRegisterModal } = useModal();
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isTwitchAuthOpen, setIsTwitchAuthOpen] = useState(false);
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  const handleGoogleSignUp = () => {
    setIsGoogleAuthOpen(true);
  };

  const handleTwitchSignUp = () => {
    setIsTwitchAuthOpen(true);
  };

  const handleCreateAccount = () => {
    openRegisterModal();
  };

  const handleLogin = () => {
    openLoginModal();
  };

  const handleDashboardNavigation = () => {
    navigation.navigate('Dashboard');
  };

  const handleUserProfileNavigation = () => {
    navigation.navigate('UserProfile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        {/* Logo Section */}
        <View style={[styles.logoSection, isMobile && styles.logoSectionMobile]}>
          <Image
            source={require('../../assets/ClipIt_logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={[styles.contentSection, isMobile && styles.contentSectionMobile]}>
          <View style={styles.contentContainer}>
            {/* Headline */}
            <Text style={styles.headline}>
              Share your best. Connect with the rest.
            </Text>

            {/* Navigation Buttons for Testing */}
            <View style={styles.devButtons}>
              <TouchableOpacity
                onPress={handleDashboardNavigation}
                style={[styles.button, styles.devButton]}
              >
                <MaterialCommunityIcons name="view-dashboard" size={22} color="#9147ff" />
                <Text style={styles.devButtonText}>Go to Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUserProfileNavigation}
                style={[styles.button, styles.devButton]}
              >
                <MaterialCommunityIcons name="account" size={22} color="#9147ff" />
                <Text style={styles.devButtonText}>Go to Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleGoogleSignUp}
                style={[styles.button, styles.googleButton]}
              >
                <GoogleIcon size={22} />
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTwitchSignUp}
                style={[styles.button, styles.twitchButton]}
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

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleCreateAccount}
              style={[styles.button, styles.createAccountButton]}
            >
              <Text style={styles.createAccountButtonText}>Create an account</Text>
            </TouchableOpacity>

            {/* Login Section */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Already signed in?</Text>
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.button, styles.loginButton]}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Modals */}
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={closeLoginModal} 
        />
      )}
      {isRegisterModalOpen && (
        <RegisterModal 
          isOpen={isRegisterModalOpen} 
          onClose={closeRegisterModal} 
        />
      )}
      {isGoogleAuthOpen && (
        <SocialAuth 
          isOpen={isGoogleAuthOpen} 
          onClose={() => setIsGoogleAuthOpen(false)} 
          provider="google" 
        />
      )}
      {isTwitchAuthOpen && (
        <SocialAuth 
          isOpen={isTwitchAuthOpen} 
          onClose={() => setIsTwitchAuthOpen(false)} 
          provider="twitch" 
        />
      )}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: Platform.select({ web: 'row', default: 'column' }),
  },
  contentMobile: {
    flexDirection: 'column',
  },
  logoSection: {
    width: Platform.select({ web: isMobile ? '100%' : '50%', default: '100%' }),
    height: Platform.select({ web: isMobile ? height * 0.3 : height, default: height * 0.3 }),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoSectionMobile: {
    height: height * 0.3,
  },
  logo: {
    width: '90%',
    height: 200,
    maxWidth: 400,
  },
  contentSection: {
    width: Platform.select({ web: isMobile ? '100%' : '50%', default: '100%' }),
    height: Platform.select({ web: isMobile ? height * 0.7 : height, default: height * 0.7 }),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentSectionMobile: {
    height: height * 0.7,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'left',
  },
  devButtons: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  devButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  devButtonText: {
    color: '#9147ff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  twitchButton: {
    backgroundColor: '#9147ff',
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  twitchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  createAccountButton: {
    backgroundColor: '#9147ff',
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
    marginRight: 8,
  },
  loginButton: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    width: 'auto',
  },
  loginButtonText: {
    color: '#9147ff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LandingPage;