import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Overview from '../screens/Overview';
import MakeMeal from '../screens/MakeMeal';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Overview" component={Overview} />
      <Tab.Screen name="Make Meal" component={MakeMeal} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
