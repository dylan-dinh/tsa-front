import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Clip } from '../types';
import VideoPlayer from './VideoPlayer';

interface VideoModalProps {
  visible: boolean;
  clip: Clip | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const VideoModal: React.FC<VideoModalProps> = ({ visible, clip, onClose }) => {
  if (!clip) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.videoContainer}>
            <VideoPlayer clip={clip} onClose={onClose} />
          </View>
          
          <View style={styles.infoContainer}>
            <h3 style={styles.title}>{clip.title || 'Untitled Clip'}</h3>
            <p style={styles.creator}>by {clip.creator_name || 'Unknown'}</p>
            <p style={styles.views}>{clip.view_count?.toLocaleString() || 0} views</p>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Platform.OS === 'web' ? Math.min(width * 0.9, 800) : width * 0.95,
    height: Platform.OS === 'web' ? Math.min(height * 0.8, 600) : height * 0.8,
    backgroundColor: '#000000',
    borderRadius: Platform.OS === 'web' ? 12 : 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    margin: 0,
  },
  creator: {
    color: '#9147ff',
    fontSize: 14,
    marginBottom: 4,
    margin: 0,
  },
  views: {
    color: '#6c757d',
    fontSize: 14,
    margin: 0,
  },
});

export default VideoModal; 