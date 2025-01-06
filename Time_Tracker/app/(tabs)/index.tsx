import { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Platform,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Task {
  id: string;
  text: string;
  time: string;
  category: 'study' | 'work' | 'personal';
  completed: boolean;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    time: '',
    category: 'study' as Task['category'],
  });

  // Load tasks from storage on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Default tasks that match the image
        const defaultTasks: Task[] = [
          {
            id: '1',
            text: 'Finish Report',
            time: '10:00 am',
            category: 'study',
            completed: false,
          },
          {
            id: '2',
            text: 'Study for Exam',
            time: '2:00 pm',
            category: 'study',
            completed: false,
          },
          {
            id: '3',
            text: 'Group Project Meeting',
            time: '4:00 pm',
            category: 'work',
            completed: false,
          },
          {
            id: '4',
            text: 'Gym Session',
            time: '6:00 pm',
            category: 'personal',
            completed: false,
          },
        ];
        setTasks(defaultTasks);
        // Store default tasks
        await AsyncStorage.setItem('tasks', JSON.stringify(defaultTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks');
    }
  };

  const toggleTaskCompletion = useCallback(async (id: string) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to update task');
    }
  }, [tasks]);

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryStyle = (category: Task['category']) => {
    const categoryStyles = {
      study: { backgroundColor: '#E8F1FF' },
      work: { backgroundColor: '#FFE8F6' },
      personal: { backgroundColor: '#E8FFE9' },
    };
    return [styles.categoryTag, categoryStyles[category]];
  };

  const addTask = async () => {
    if (!newTask.text.trim() || !newTask.time.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      text: newTask.text.trim(),
      time: newTask.time.trim(),
      category: newTask.category,
      completed: false,
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    // Reset form and close modal
    setNewTask({ text: '', time: '', category: 'study' });
    setIsModalVisible(false);
  };

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>My Tasks</ThemedText>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Tasks"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.taskList}>
        <ThemedText style={styles.sectionTitle}>Today's Tasks</ThemedText>
        
        {filteredTasks.map((task) => (
          <Pressable 
            key={task.id} 
            style={styles.taskItem}
          >
            <Pressable
              onPress={() => toggleTaskCompletion(task.id)}
              style={[styles.checkbox, task.completed && styles.checkboxChecked]} 
            />
            <View style={styles.taskContent}>
              <ThemedText style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
                {task.text}
              </ThemedText>
              <View style={getCategoryStyle(task.category)}>
                <ThemedText style={styles.categoryText}>{task.category}</ThemedText>
              </View>
            </View>
            <View style={styles.taskActions}>
              <ThemedText style={styles.timeText}>{task.time}</ThemedText>
              <Pressable 
                onPress={() => deleteTask(task.id)}
                style={styles.deleteButton}
              >
                <IconSymbol name="trash" size={18} color="#FF4444" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Add Task Button */}
      <View style={styles.addButtonContainer}>
        <Pressable 
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <ThemedText style={styles.addButtonText}>+</ThemedText>
        </Pressable>
      </View>

      {/* Add Task Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Add New Task</ThemedText>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Task name"
              value={newTask.text}
              onChangeText={(text) => setNewTask(prev => ({ ...prev, text }))}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Time (e.g., 2:00 pm)"
              value={newTask.time}
              onChangeText={(time) => setNewTask(prev => ({ ...prev, time }))}
              placeholderTextColor="#999"
            />

            <View style={styles.categoryButtons}>
              {(['study', 'work', 'personal'] as const).map((category) => (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryButton,
                    newTask.category === category && styles.categoryButtonSelected
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, category }))}
                >
                  <ThemedText 
                    style={[
                      styles.categoryButtonText,
                      newTask.category === category && styles.categoryButtonTextSelected
                    ]}
                  >
                    {category}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewTask({ text: '', time: '', category: 'study' });
                  setIsModalVisible(false);
                }}
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.addButton]}
                onPress={addTask}
              >
                <ThemedText style={[styles.modalButtonText, styles.modalAddButtonText]}>
                  Add Task
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000000',
  },
  taskList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4A3780',
    borderColor: '#4A3780',
  },
  taskContent: {
    flex: 1,
    marginRight: 12,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000000',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  timeText: {
    fontSize: 14,
    color: '#000000',
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#000000',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A3780',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: -2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000000',
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  categoryButtonSelected: {
    backgroundColor: '#4A3780',
  },
  categoryButtonText: {
    color: '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  deleteButton: {
    padding: 8,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
  },
  modalAddButtonText: {
    color: '#FFFFFF',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
});
