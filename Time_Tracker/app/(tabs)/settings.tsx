import React from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MenuItemProps {
  icon: 'rectangle.portrait.and.arrow.right.fill' | 'info.circle.fill';
  title: string;
  onPress: () => void;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, color = "#000000" }) => (
  <Pressable 
    style={styles.menuItem}
    onPress={onPress}
  >
    <View style={styles.menuItemContent}>
      <IconSymbol name={icon} size={20} color={color} />
      <ThemedText style={[styles.menuItemText, { color }]}>{title}</ThemedText>
    </View>
    <IconSymbol name="chevron.right" size={20} color="#999" />
  </Pressable>
);

export default function SettingsScreen() {
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['isLoggedIn', 'userCredentials']);
              router.replace("/auth/login");
            } catch (error) {
              console.error('Failed to logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Settings</ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Account</ThemedText>
        <MenuItem
          icon="rectangle.portrait.and.arrow.right.fill"
          title="Logout"
          onPress={handleLogout}
          color="#FF4444"
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <MenuItem
          icon="info.circle.fill"
          title="Version 1.0.0"
          onPress={() => Alert.alert("About", "Time Tracker App\nVersion 1.0.0")}
        />
        
        <View style={styles.appInfo}>
          <ThemedText style={styles.appInfoText}>Time Tracker</ThemedText>
          <ThemedText style={styles.createdByText}>Created by: Yadu Krishnan Shaji</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  appInfo: {
    marginTop: 20,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  appInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  createdByText: {
    fontSize: 14,
    color: '#666666',
  },
}); 