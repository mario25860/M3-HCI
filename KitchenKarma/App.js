import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import 'react-native-gesture-handler';
import { ProfileProvider } from './screens/ProfileContext';
import ProfileDisplayScreen from './screens/ProfileSaved'; // Profilanzeigebildschirm
import ProfileForm from './screens/Profile';
import ProfileConfirmation from './screens/ProfileConfirmation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProfileProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileSaved" component={ProfileDisplayScreen} />
          <Stack.Screen name="Profile" component={ProfileForm} />
          <Stack.Screen name="ProfileConfirmation" component={ProfileConfirmation} />
          {/* Weitere Bildschirme hier hinzufügen, die nicht im Bottom Tab Navigator enthalten sind */}
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
}
