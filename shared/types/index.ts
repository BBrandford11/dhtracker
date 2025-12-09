// Shared types for backend, mobile, and web

export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: 'google' | 'facebook';
  isPublicProfile: boolean;
  createdAt: Date;
}

export interface Spot {
  id: string;
  name: string;
  distanceMeters: number;
  description?: string;
  creatorUserId: string;
  createdAt: Date;
}

export interface Run {
  id: string;
  spotId: string;
  userId: string;
  numberOfRuns: number;
  dateLogged: Date;
}

export interface UserStats {
  userId: string;
  runsThisYear: number;
  lifetimeRuns: number;
  totalDistance: number;
  totalLaps: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  runsThisYear: number;
  lifetimeRuns: number;
  totalDistance: number;
  totalLaps: number;
}

export interface CreateSpotRequest {
  name: string;
  distanceMeters: number;
  description?: string;
}

export interface CreateRunRequest {
  spotId: string;
  numberOfRuns: number;
  notes?: string;
}




