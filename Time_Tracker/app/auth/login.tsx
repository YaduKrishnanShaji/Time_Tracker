import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Basic validation
      if (!credentials.email || !credentials.password) {
        setError('Please fill in all fields');
        return;
      }

      // Store credentials
      await AsyncStorage.setItem('userCredentials', JSON.stringify(credentials));
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={credentials.email}
            onChangeText={(text) => {
              setCredentials(prev => ({ ...prev, email: text }));
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={credentials.password}
            onChangeText={(text) => {
              setCredentials(prev => ({ ...prev, password: text }));
              setError('');
            }}
            secureTextEntry
            placeholderTextColor="#999"
          />

          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  loginButton: {
    backgroundColor: '#4A3780',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
  },
}); 