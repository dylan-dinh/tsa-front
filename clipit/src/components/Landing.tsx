// Requirements to run this component:
// npm install @expo/vector-icons react-icons
//test git status

import React, { useState, Suspense } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Login from './Login';
import Register from './Register';
import SocialAuth from './SocialAuth';
import { useModal } from '../context/ModalContext';

const FcGoogle = React.lazy(() =>
  import('react-icons/fc').then(module => ({ default: module.FcGoogle as React.ComponentType<any> }))
);

type RootStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Register: undefined;
  UserProfile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

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

  return (
    <View style={styles.container}>
      {/* Left: Logo Section */}
      <View style={styles.logoSection}>
        <Image
          source={require('../../assets/ClipIt_logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right: Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.contentContainer}>
          {/* Headline */}
          <Text style={styles.headline}>
            Share your best. Connect with the rest.
          </Text>

          {/* Sign Up Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleGoogleSignUp}
              style={[styles.button, styles.googleButton]}
            >
              <Suspense fallback={null}>
                <FcGoogle size={22} />
              </Suspense>
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

      {/* Modals */}
      <Login isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <Register isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <SocialAuth 
        isOpen={isGoogleAuthOpen} 
        onClose={() => setIsGoogleAuthOpen(false)} 
        provider="google" 
      />
      <SocialAuth 
        isOpen={isTwitchAuthOpen} 
        onClose={() => setIsTwitchAuthOpen(false)} 
        provider="twitch" 
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  logoSection: {
    width: '50%',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '90%',
    height: 200,
    maxWidth: 400,
  },
  contentSection: {
    width: '50%',
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    textAlign: 'left',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  twitchButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
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
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  createAccountButton: {
    backgroundColor: '#9147ff',
    marginBottom: 32,
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    alignItems: 'center',
    gap: 16,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  loginButtonText: {
    color: '#9147ff',
    fontSize: 16,
    fontWeight: '600',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingPage;