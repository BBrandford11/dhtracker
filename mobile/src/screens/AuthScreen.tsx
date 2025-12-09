import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

// Note: In production, configure these properly
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '';

export default function AuthScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Simplified OAuth flow - in production, use proper OAuth providers
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // For MVP, we'll use a simplified approach
      // In production, implement proper Google OAuth flow
      Alert.alert(
        'Google Login',
        'Enter your Google account details',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
            {
              text: 'Demo Login',
              onPress: async () => {
                // Demo login - replace with actual OAuth
                const demoData = {
                  provider: 'google' as const,
                  providerId: `google_${Date.now()}`,
                  email: 'demo@example.com',
                  name: 'Demo User',
                };
                
                try {
                  const result = await ApiClient.login(
                    demoData.provider,
                    demoData.providerId,
                    demoData.email,
                    demoData.name
                  );
                  await login(result.token);
                } catch (error: any) {
                  console.error('Login error:', error);
                  let errorMessage = 'Login failed';
                  if (error.response) {
                    // Server responded with error
                    errorMessage = error.response.data?.error || error.response.statusText || 'Server error';
                  } else if (error.request) {
                    // Request made but no response (network error)
                    errorMessage = 'Cannot connect to server. Make sure the backend is running and check your API URL.';
                  } else {
                    // Something else happened
                    errorMessage = error.message || 'Login failed';
                  }
                  Alert.alert('Login Error', errorMessage);
                } finally {
                  setLoading(false);
                }
              },
            },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Google');
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      // For MVP, we'll use a simplified approach
      Alert.alert(
        'Facebook Login',
        'Enter your Facebook account details',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
            {
              text: 'Demo Login',
              onPress: async () => {
                // Demo login - replace with actual OAuth
                const demoData = {
                  provider: 'facebook' as const,
                  providerId: `facebook_${Date.now()}`,
                  email: 'demo@example.com',
                  name: 'Demo User',
                };
                
                try {
                  const result = await ApiClient.login(
                    demoData.provider,
                    demoData.providerId,
                    demoData.email,
                    demoData.name
                  );
                  await login(result.token);
                } catch (error: any) {
                  console.error('Login error:', error);
                  let errorMessage = 'Login failed';
                  if (error.response) {
                    // Server responded with error
                    errorMessage = error.response.data?.error || error.response.statusText || 'Server error';
                  } else if (error.request) {
                    // Request made but no response (network error)
                    errorMessage = 'Cannot connect to server. Make sure the backend is running and check your API URL.';
                  } else {
                    // Something else happened
                    errorMessage = error.message || 'Login failed';
                  }
                  Alert.alert('Login Error', errorMessage);
                } finally {
                  setLoading(false);
                }
              },
            },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to login with Facebook');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DHTracker</Text>
      <Text style={styles.subtitle}>Track your downhill runs</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.facebookButton]}
          onPress={handleFacebookLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue with Facebook</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});




