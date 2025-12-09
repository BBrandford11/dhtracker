import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ApiClient } from '../services/api';
import { LeaderboardEntry } from '../../../shared/types';

type LeaderboardType = 'runsThisYear' | 'lifetimeRuns' | 'totalDistance' | 'totalLaps';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<LeaderboardType>('runsThisYear');

  useEffect(() => {
    loadLeaderboard();
  }, [selectedType]);

  const loadLeaderboard = async () => {
    try {
      const data = await ApiClient.getLeaderboard(selectedType);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  const getTypeLabel = (type: LeaderboardType) => {
    switch (type) {
      case 'runsThisYear':
        return 'Runs This Year';
      case 'lifetimeRuns':
        return 'Lifetime Runs';
      case 'totalDistance':
        return 'Total Distance';
      case 'totalLaps':
        return 'Total Laps';
    }
  };

  const getValue = (entry: LeaderboardEntry) => {
    switch (selectedType) {
      case 'runsThisYear':
        return entry.runsThisYear;
      case 'lifetimeRuns':
        return entry.lifetimeRuns;
      case 'totalDistance':
        return formatDistance(entry.totalDistance);
      case 'totalLaps':
        return entry.totalLaps;
    }
  };

  const types: LeaderboardType[] = ['runsThisYear', 'lifetimeRuns', 'totalDistance', 'totalLaps'];

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
        <Text style={styles.title}>Leaderboard</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonSelected,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === type && styles.typeButtonTextSelected,
              ]}
            >
              {getTypeLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.userId}
        renderItem={({ item, index }) => (
          <View style={styles.entryCard}>
            <View style={styles.rankContainer}>
              <Text style={styles.rank}>#{index + 1}</Text>
            </View>
            <View style={styles.entryInfo}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.value}>{getValue(item)}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No entries yet</Text>
          </View>
        }
      />
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  typeSelector: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  entryInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});




