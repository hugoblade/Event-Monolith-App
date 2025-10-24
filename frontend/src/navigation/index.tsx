import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import EventListScreen from '../screens/EventListScreen';
import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Events: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, loading } = useAuth();

  // If loading, you can return a splash indicator
  // For simplicity we proceed to stack navigator
  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Sign In' }}
        />
      ) : (
        <Stack.Screen
          name="Events"
          component={EventListScreen}
          options={{ title: 'Events' }}
        />
      )}
    </Stack.Navigator>
  );
}