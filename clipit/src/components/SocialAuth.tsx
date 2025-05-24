import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Image, Modal, Alert, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

type RootStackParamList = {
  Dashboard: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const CLipIt_Logo = process.env.PUBLIC_URL + '/ClipIt_logo.jpeg';

interface SocialAuthProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'google' | 'twitch';
}

const SocialAuth: React.FC<SocialAuthProps> = ({ isOpen, onClose, provider }) => {
  const [error, setError] = useState('');
  const navigation = useNavigation<NavigationProp>();

  if (!isOpen) return null;

  const handleAuth = async () => {
    try {
      // Configure OAuth endpoints based on provider
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      const clientId = provider === 'google' 
        ? 'YOUR_GOOGLE_CLIENT_ID'
        : 'YOUR_TWITCH_CLIENT_ID';
      
      const authUrl = provider === 'google'
        ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`
        : `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=user:read:email`;

      const result = await AuthSession.startAsync({
        authUrl,
        returnUrl: redirectUri,
      });

      if (result.type === 'success') {
        // Handle successful authentication
        navigation.navigate('Dashboard');
      } else {
        setError('Authentication failed. Please try again.');
        Alert.alert('Error', error);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      Alert.alert('Error', error);
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
            {/* Logo */}
            <Image
              source={{ uri: CLipIt_Logo }}
              style={{ height: 48, width: 'auto', resizeMode: 'contain' }}
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
                provider === 'google' ? styles.googleButton : styles.twitchButton
              ]}
            >
              <MaterialCommunityIcons
                name={provider === 'google' ? 'google' : 'twitch'}
                size={22}
                color={provider === 'google' ? '#4285F4' : 'white'}
                style={styles.buttonIcon}
              />
              <Text style={[
                styles.buttonText,
                provider === 'google' ? styles.googleButtonText : styles.twitchButtonText
              ]}>
                Continue with {provider === 'google' ? 'Google' : 'Twitch'}
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
  },
  content: {
    alignItems: 'center',
    marginTop: 16,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 16,
  },
  authButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
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
  },
  googleButtonText: {
    color: '#111827',
  },
  twitchButtonText: {
    color: 'white',
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SocialAuth; 