import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Du kannst auch andere Icon Libraries verwenden
import Overview from '../screens/Overview';
import MakeMeal from '../screens/MakeMeal';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Overview') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Make Meal') {
            iconName = focused ? 'restaurant-menu' : 'restaurant-menu';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person';
          }

          // Du kannst hier jede Icon-Bibliothek verwenden, z.B. MaterialIcons, FontAwesome etc.
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Overview" component={Overview} />
      <Tab.Screen name="Make Meal" component={MakeMeal} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
