'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Spot, LeaderboardEntry } from '../../../shared/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'spots' | 'leaderboard'>('spots');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'spots') {
        const response = await fetch(`${API_BASE_URL}/spots`);
        const data = await response.json();
        setSpots(data);
      } else {
        const response = await fetch(`${API_BASE_URL}/leaderboard?type=runsThisYear&limit=50`);
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>DHTracker</h1>
        <p className={styles.subtitle}>Downhill Skater Community</p>
      </header>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${activeTab === 'spots' ? styles.active : ''}`}
          onClick={() => setActiveTab('spots')}
        >
          Spots
        </button>
        <button
          className={`${styles.navButton} ${activeTab === 'leaderboard' ? styles.active : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </nav>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === 'spots' ? (
          <div className={styles.spotsGrid}>
            {spots.map((spot) => (
              <div key={spot.id} className={styles.spotCard}>
                <h2 className={styles.spotName}>{spot.name}</h2>
                <p className={styles.spotDistance}>{formatDistance(spot.distanceMeters)}</p>
                {spot.description && (
                  <p className={styles.spotDescription}>{spot.description}</p>
                )}
                {spot.creatorName && (
                  <p className={styles.spotCreator}>Created by {spot.creatorName}</p>
                )}
              </div>
            ))}
            {spots.length === 0 && (
              <div className={styles.empty}>No spots yet</div>
            )}
          </div>
        ) : (
          <div className={styles.leaderboard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Rider</th>
                  <th>Runs This Year</th>
                  <th>Lifetime Runs</th>
                  <th>Total Distance</th>
                  <th>Total Laps</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.userId}>
                    <td className={styles.rank}>#{index + 1}</td>
                    <td className={styles.name}>{entry.userName}</td>
                    <td>{entry.runsThisYear}</td>
                    <td>{entry.lifetimeRuns}</td>
                    <td>{formatDistance(entry.totalDistance)}</td>
                    <td>{entry.totalLaps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leaderboard.length === 0 && (
              <div className={styles.empty}>No leaderboard entries yet</div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Download the mobile app to track your runs and join the community!</p>
      </footer>
    </div>
  );
}




