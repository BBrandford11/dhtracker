import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthContext } from './src/context/AuthContext';
import DashboardScreen from './src/screens/DashboardScreen';
import SpotsScreen from './src/screens/SpotsScreen';
import AddRunScreen from './src/screens/AddRunScreen';
import StatsScreen from './src/screens/StatsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Spots" 
        component={SpotsScreen}
        options={{ title: 'Spots' }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{ title: 'Stats' }}
      />
      <Tab.Screen 
        name="Leaderboard" 
        component={LeaderboardScreen}
        options={{ title: 'Leaderboard' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  // Skip authentication for now - always show main app
  const token = null; // No token needed

  const login = async (newToken: string) => {
    // No-op for now
  };

  const logout = async () => {
    // No-op for now
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="AddRun" 
              component={AddRunScreen}
              options={{ 
                presentation: 'modal',
                headerShown: true,
                title: 'Add Run'
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

