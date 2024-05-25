import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Für das umrundete X-Symbol
import { useProfile } from './ProfileContext';

import Modal from 'react-native-modal';

const ProfileForm = ({navigation}) => {
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedHealth, setSelectedHealth] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [cuisineModalVisible, setCuisineModalVisible] = useState(false);

  const handleSignUp = () => {
    if (name.trim() !== '') {
      console.log('Sign Up button pressed');
      navigation.navigate('ProfileForm');
    }
  };

  const diets = [
    'Balanced',
    'High-Fiber',
    'High-Protein',
    'Low-Carb',
    'Low-Fat',
    'Low-Sodium'
  ];

  const healths = [
    'Alcohol-Cocktail',
    'Alcohol-Free',
    'Celery-Free',
    'Crustacean-Free',
    'Dairy-Free',
    'DASH',
    'Egg-Free',
    'Fish-Free',
    'FODMAP-Free',
    'Gluten-Free',
    'Immuno-Supportive',
    'Keto-Friendly',
    'Kidney-Friendly',
    'Kosher',
    'Low Potassium',
    'Low Sugar',
    'Lupine-Free',
    'Mediterranean',
    'Mollusk-Free',
    'Mustard-Free',
    'No oil added',
    'Paleo',
    'Peanut-Free',
    'Pescatarian',
    'Pork-Free',
    'Red-Meat-Free',
    'Sesame-Free',
    'Shellfish-Free',
    'Soy-Free',
    'Sugar-Conscious',
    'Sulfite-Free',
    'Tree-Nut-Free',
    'Vegan',
    'Vegetarian',
    'Wheat-Free'
  ];

  const cuisines = [
    'American',
    'Asian',
    'British',
    'Caribbean',
    'Central Europe',
    'Chinese',
    'Eastern Europe',
    'French',
    'Greek',
    'Indian',
    'Italian',
    'Japanese',
    'Korean',
    'Kosher',
    'Mediterranean',
    'Mexican',
    'Middle Eastern',
    'Nordic',
    'South American',
    'South East Asian',
    'World+'
  ];

  const handleProfileCreation = () => {
    const newProfile = { name, selectedDiet, selectedHealth, selectedCuisine };
    updateProfile(newProfile);
    navigation.navigate(`ProfileConfirmation`);
  };

  const logProfile = () => {
    console.log('Name:', name);
    console.log('Diet:', selectedDiet);
    console.log('Health:', selectedHealth);
    console.log('Cuisine:', selectedCuisine);
  };

  const handleEatEverything = () => {
    setSelectedDiet('');
    setSelectedHealth('');
    setSelectedCuisine('');
  };

  const renderModalItems = (options, setSelectedValue) => (
    <ScrollView>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.modalItem}
          onPress={() => {
            setSelectedValue(option);
            setDietModalVisible(false);
            setHealthModalVisible(false);
            setCuisineModalVisible(false);
          }}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Diet:</Text>
        <TouchableOpacity style={styles.dropdownContainer} onPress={() => setDietModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedDiet || 'Choose Diet'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Health:</Text>
        <TouchableOpacity style={styles.dropdownContainer} onPress={() => setHealthModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedHealth || 'Choose Health'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Cuisine:</Text>
        <TouchableOpacity style={styles.dropdownContainer} onPress={() => setCuisineModalVisible(true)}>
          <Text style={styles.dropdownText}>{selectedCuisine || 'Choose Cuisine'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.eatEverythingButton} 
          onPress={handleEatEverything}>
          <Text style={styles.buttonText}>I eat everything</Text>
          <Ionicons name="checkmark-circle-outline" size={40} color="green" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signUpButton, name.trim() === '' && styles.disabledButton]}
          onPress={(handleSignUp, handleProfileCreation)}
          disabled={name.trim() === ''}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>


        <Modal visible={dietModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setDietModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            {renderModalItems(diets, setSelectedDiet)}
          </View>
        </Modal>

        <Modal visible={healthModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setHealthModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            {renderModalItems(healths, setSelectedHealth)}
          </View>
        </Modal>

        <Modal visible={cuisineModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCuisineModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            {renderModalItems(cuisines, setSelectedCuisine)}
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eatEverythingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  signUpButton: {
    backgroundColor: '#5C7AEA',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ProfileForm;