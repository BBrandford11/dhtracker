import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

// Log API URL for debugging (only in development)
if (__DEV__) {
  console.log('API Base URL:', API_BASE_URL);
}

class ApiClientClass {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async login(provider: 'google' | 'facebook', providerId: string, email: string, name: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        provider,
        providerId,
        email,
        name,
      });
      return response.data;
    } catch (error: any) {
      // Log full error for debugging
      if (__DEV__) {
        console.error('API Login Error:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          url: `${API_BASE_URL}/auth/login`,
        });
      }
      throw error;
    }
  }

  async getMe() {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateProfile(isPublicProfile: boolean) {
    const response = await axios.patch(
      `${API_BASE_URL}/auth/me`,
      { isPublicProfile },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async getSpots() {
    const response = await axios.get(`${API_BASE_URL}/spots`);
    return response.data;
  }

  async getSpot(id: string) {
    const response = await axios.get(`${API_BASE_URL}/spots/${id}`);
    return response.data;
  }

  async createSpot(name: string, distanceMeters: number, description?: string) {
    const response = await axios.post(
      `${API_BASE_URL}/spots`,
      { name, distanceMeters, description },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async updateSpot(id: string, data: { name?: string; distanceMeters?: number; description?: string }) {
    const response = await axios.put(
      `${API_BASE_URL}/spots/${id}`,
      data,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async deleteSpot(id: string) {
    const response = await axios.delete(`${API_BASE_URL}/spots/${id}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getMyRuns() {
    const response = await axios.get(`${API_BASE_URL}/runs/me`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createRun(spotId: string, numberOfRuns: number, notes?: string, dateLogged?: Date) {
    const response = await axios.post(
      `${API_BASE_URL}/runs`,
      { spotId, numberOfRuns, notes, dateLogged },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async getMyStats() {
    const response = await axios.get(`${API_BASE_URL}/runs/me/stats`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async getLeaderboard(type: 'runsThisYear' | 'lifetimeRuns' | 'totalDistance' | 'totalLaps' = 'runsThisYear', limit = 100) {
    const response = await axios.get(`${API_BASE_URL}/leaderboard`, {
      params: { type, limit },
    });
    return response.data;
  }
}

export const ApiClient = new ApiClientClass();




