import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; // Du kannst auch andere Icon Libraries verwenden
import MyFridge from '../screens/MyFridge';
import MakeMeal from '../screens/MakeMeal';
import Profile from '../screens/Profile';
import ProfileDisplayScreen from '../screens/ProfileSaved';
import Groups from '../screens/Groups';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent;

          if (route.name === 'My Fridge') {
            iconName = focused ? 'fridge' : 'fridge-outline';
            IconComponent = MaterialCommunityIcons; 
          } else if (route.name === 'Make Meal') {
            iconName = focused ? 'restaurant-menu' : 'restaurant-menu';
            IconComponent = MaterialIcons; 
          } else if (route.name === 'Groups') {
            iconName = focused ? 'group' : 'group';
            IconComponent = MaterialIcons; 
          } else if (route.name === 'ProfileDisplay') {
            iconName = focused ? 'person' : 'person';
            IconComponent = MaterialIcons; 
          }
          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Groups" component={Groups} />
      <Tab.Screen name="My Fridge" component={MyFridge} />
      <Tab.Screen name="Make Meal" component={MakeMeal} />
      <Tab.Screen name="ProfileDisplay" component={ProfileDisplayScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
