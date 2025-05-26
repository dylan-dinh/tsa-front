import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Image, Modal, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import GoogleIcon from './GoogleIcon';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SocialAuthProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'google' | 'twitch';
}

const SocialAuth: React.FC<SocialAuthProps> = ({ isOpen, onClose, provider }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  if (!isOpen) return null;

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      // Simulate successful authentication
      await SecureStore.setItemAsync('userToken', `${provider}-oauth-token`);
      navigation.navigate('Dashboard');
      onClose();
    } catch (err) {
      setError('Authentication failed. Please try again.');
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {/* Logo - Using the same ClipIt logo as Landing page */}
            <Image
              source={require('../../assets/ClipIt_logo.jpeg')}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Headline */}
            <Text style={styles.headline}>
              {provider === 'google' ? 'Sign in with Google' : 'Sign in with Twitch'}
            </Text>

            {/* Auth Button */}
            <TouchableOpacity
              onPress={handleAuth}
              style={[
                styles.authButton,
                provider === 'google' ? styles.googleButton : styles.twitchButton,
                isLoading && styles.buttonDisabled
              ]}
              disabled={isLoading}
            >
              {provider === 'google' ? (
                <GoogleIcon size={22} />
              ) : (
                <MaterialCommunityIcons
                  name="twitch"
                  size={22}
                  color="white"
                  style={styles.buttonIcon}
                />
              )}
              <Text style={[
                styles.buttonText,
                provider === 'google' ? styles.googleButtonText : styles.twitchButtonText
              ]}>
                {isLoading 
                  ? 'Connecting...' 
                  : `Continue with ${provider === 'google' ? 'Google' : 'Twitch'}`
                }
              </Text>
            </TouchableOpacity>

            {/* Info Text */}
            <Text style={styles.infoText}>
              By continuing, you agree to ClipIt's Terms of Service and Privacy Policy
            </Text>
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
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  twitchButton: {
    backgroundColor: '#9147ff',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  googleButtonText: {
    color: '#111827',
  },
  twitchButtonText: {
    color: 'white',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SocialAuth; 