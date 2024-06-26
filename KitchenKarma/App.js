import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyFridge from './screens/MyFridge';
import MakeMeal from './screens/MakeMeal';
import Profile from './screens/Profile';
import Groups from './screens/Groups';
import { AppProvider } from './context/AppContext';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
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
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person';
                IconComponent = MaterialIcons;
              } else if (route.name === 'Groups') {
                iconName = focused ? 'group' : 'group';
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
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
