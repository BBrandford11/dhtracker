import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ApiClient } from '../services/api';
import { Spot } from '../../../shared/types';

export default function AddRunScreen() {
  const navigation = useNavigation();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [numberOfRuns, setNumberOfRuns] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedSpot) {
      Alert.alert('Error', 'Please select a spot');
      return;
    }

    const runs = parseInt(numberOfRuns);
    if (isNaN(runs) || runs <= 0) {
      Alert.alert('Error', 'Please enter a valid number of runs');
      return;
    }

    setSubmitting(true);
    try {
      await ApiClient.createRun(selectedSpot.id, runs, notes || undefined);
      Alert.alert('Success', 'Run logged!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to log run');
    } finally {
      setSubmitting(false);
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Select Spot</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.spotsContainer}>
          {spots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={[
                styles.spotButton,
                selectedSpot?.id === spot.id && styles.spotButtonSelected,
              ]}
              onPress={() => setSelectedSpot(spot)}
            >
              <Text
                style={[
                  styles.spotButtonText,
                  selectedSpot?.id === spot.id && styles.spotButtonTextSelected,
                ]}
              >
                {spot.name}
              </Text>
              <Text
                style={[
                  styles.spotButtonDistance,
                  selectedSpot?.id === spot.id && styles.spotButtonDistanceSelected,
                ]}
              >
                {formatDistance(spot.distanceMeters)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Number of Runs</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of runs"
          value={numberOfRuns}
          onChangeText={setNumberOfRuns}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any notes about this session..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Log Run</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
  },
  spotsContainer: {
    marginBottom: 8,
  },
  spotButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  spotButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f7ff',
  },
  spotButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  spotButtonTextSelected: {
    color: '#007AFF',
  },
  spotButtonDistance: {
    fontSize: 12,
    color: '#666',
  },
  spotButtonDistanceSelected: {
    color: '#007AFF',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});




