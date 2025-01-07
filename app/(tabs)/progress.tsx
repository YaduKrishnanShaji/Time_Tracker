import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useFocusEffect } from '@react-navigation/native';

interface Task {
  id: string;
  text: string;
  time: string;
  category: 'study' | 'work' | 'personal';
  completed: boolean;
}

interface Stats {
  total: number;
  completed: number;
  study: number;
  work: number;
  personal: number;
}

export default function ProgressScreen() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    study: 0,
    work: 0,
    personal: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const tasks: Task[] = JSON.parse(storedTasks);
        const newStats = {
          total: tasks.length,
          completed: tasks.filter(t => t.completed).length,
          study: tasks.filter(t => t.category === 'study').length,
          work: tasks.filter(t => t.category === 'work').length,
          personal: tasks.filter(t => t.category === 'personal').length,
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const getCompletionPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Progress</ThemedText>

      <ScrollView style={styles.content}>
        {/* Overall Progress */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Overall Progress</ThemedText>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${getCompletionPercentage()}%` }
              ]} 
            />
          </View>
          <ThemedText style={styles.progressText}>
            {getCompletionPercentage()}% Complete
          </ThemedText>
        </ThemedView>

        {/* Task Statistics */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Task Statistics</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.total}</ThemedText>
              <ThemedText style={styles.statLabel}>Total Tasks</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{stats.completed}</ThemedText>
              <ThemedText style={styles.statLabel}>Completed</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Category Breakdown */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Category Breakdown</ThemedText>
          <View style={styles.categoryList}>
            <View style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: '#E8F1FF' }]} />
              <ThemedText style={styles.categoryLabel}>Study</ThemedText>
              <ThemedText style={styles.categoryCount}>{stats.study}</ThemedText>
            </View>
            <View style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: '#FFE8F6' }]} />
              <ThemedText style={styles.categoryLabel}>Work</ThemedText>
              <ThemedText style={styles.categoryCount}>{stats.work}</ThemedText>
            </View>
            <View style={styles.categoryItem}>
              <View style={[styles.categoryDot, { backgroundColor: '#E8FFE9' }]} />
              <ThemedText style={styles.categoryLabel}>Personal</ThemedText>
              <ThemedText style={styles.categoryCount}>{stats.personal}</ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
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
    marginBottom: 20,
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000000',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A3780',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A3780',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  categoryList: {
    gap: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000000',
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A3780',
  },
}); 