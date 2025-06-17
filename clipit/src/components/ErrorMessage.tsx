import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="alert-circle" size={24} color="#ef4444" />
        <Text style={styles.message}>{message}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    marginLeft: 8,
    color: '#991b1b',
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ErrorMessage;
