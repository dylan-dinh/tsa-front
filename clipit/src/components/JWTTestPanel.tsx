import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { runJWTTests, testCustomToken, createTestToken } from '../utils/jwt.test';
import { JWTPayload } from '../utils/jwt';

interface JWTTestPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const JWTTestPanel: React.FC<JWTTestPanelProps> = ({ isVisible, onClose }) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Capturer les logs de console
    const originalLog = console.log;
    const logs: string[] = [];
    
    console.log = (...args: any[]) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };

    try {
      const success = runJWTTests();
      setTestResults(logs);
      
      if (success) {
        Alert.alert('Tests JWT', 'Tous les tests JWT ont réussi ! 🎉');
      } else {
        Alert.alert('Tests JWT', 'Certains tests JWT ont échoué. Vérifiez les logs.');
      }
    } catch (error) {
      setTestResults([`Erreur lors des tests: ${error}`]);
      Alert.alert('Erreur', 'Erreur lors de l\'exécution des tests JWT');
    } finally {
      console.log = originalLog;
      setIsRunning(false);
    }
  };

  const testCustomTokenExample = () => {
    const customPayload: Partial<JWTPayload> = {
      sub: 'test-user-123',
      email: 'test@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600 // Expire dans 1 heure
    };

    const success = testCustomToken(customPayload);
    Alert.alert(
      'Test Token Personnalisé', 
      success ? 'Token personnalisé valide !' : 'Token personnalisé invalide !'
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Tests JWT</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={runTests} 
          style={[styles.button, styles.primaryButton]}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Tests en cours...' : 'Lancer les Tests JWT'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={testCustomTokenExample} 
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={styles.buttonText}>Test Token Personnalisé</Text>
        </TouchableOpacity>
      </View>

      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Résultats des Tests:</Text>
          <ScrollView style={styles.logsContainer}>
            {testResults.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Fonctionnalités Testées:</Text>
        <Text style={styles.infoText}>• Vérification de la structure JWT</Text>
        <Text style={styles.infoText}>• Validation de l'expiration</Text>
        <Text style={styles.infoText}>• Extraction des informations utilisateur</Text>
        <Text style={styles.infoText}>• Détection d'expiration proche</Text>
        <Text style={styles.infoText}>• Gestion des tokens malformés</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#9147ff',
  },
  secondaryButton: {
    backgroundColor: '#2ea44f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logsContainer: {
    flex: 1,
  },
  logText: {
    color: '#00ff00',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
}); 