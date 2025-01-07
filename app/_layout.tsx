import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, [segments]);

  const checkAuth = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const inAuthGroup = segments[0] === 'auth';

      if (!isLoggedIn && !inAuthGroup) {
        // Redirect to login if not logged in and not already in auth group
        router.replace('/auth/login');
      } else if (isLoggedIn && inAuthGroup) {
        // Redirect to home if logged in but still in auth group
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Failed to check auth status');
    }
  };

  return <Slot />;
}
