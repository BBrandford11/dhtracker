import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { ApiClient } from '../services/api';
import { Spot } from '../../../shared/types';

export default function SpotsScreen() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotDistance, setNewSpotDistance] = useState('');
  const [newSpotDescription, setNewSpotDescription] = useState('');

  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    try {
      const data = await ApiClient.getSpots();
      setSpots(data);
    } catch (error) {
      console.error('Error loading spots:', error);
      Alert.alert('Error', 'Failed to load spots');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpot = async () => {
    if (!newSpotName || !newSpotDistance) {
      Alert.alert('Error', 'Please fill in name and distance');
      return;
    }

    const distance = parseFloat(newSpotDistance);
    if (isNaN(distance) || distance <= 0) {
      Alert.alert('Error', 'Distance must be a positive number');
      return;
    }

    try {
      await ApiClient.createSpot(newSpotName, distance, newSpotDescription || undefined);
      setModalVisible(false);
      setNewSpotName('');
      setNewSpotDistance('');
      setNewSpotDescription('');
      loadSpots();
      Alert.alert('Success', 'Spot created!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create spot');
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spots</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Spot</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={spots}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.spotCard}>
            <Text style={styles.spotName}>{item.name}</Text>
            <Text style={styles.spotDistance}>{formatDistance(item.distanceMeters)}</Text>
            {item.description && (
              <Text style={styles.spotDescription}>{item.description}</Text>
            )}
            {item.creatorName && (
              <Text style={styles.spotCreator}>Created by {item.creatorName}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Spot</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Spot Name"
              value={newSpotName}
              onChangeText={setNewSpotName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Distance (meters)"
              value={newSpotDistance}
              onChangeText={setNewSpotDistance}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newSpotDescription}
              onChangeText={setNewSpotDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateSpot}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  spotCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  spotDistance: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  spotDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  spotCreator: {
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#007AFF',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});




