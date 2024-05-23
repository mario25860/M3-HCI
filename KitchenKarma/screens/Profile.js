import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Button, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Profile = () => {
  const { profile, setProfile } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchIngredients = async (query) => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
      const filteredResults = response.data.meals.filter(ingredient =>
        ingredient.strIngredient.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchIngredients(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const saveProfile = () => {
    Alert.alert('Profile Saved', `Name: ${profile.name}\nDiet Type: ${profile.dietType}\nArea: ${profile.area}\nAllergies & Dislikes: ${profile.allergies.join(', ')}`);
  };

  const addAllergy = (item) => {
    setProfile({
      ...profile,
      allergies: [...profile.allergies, item.strIngredient]
    });
    setModalVisible(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={(name) => setProfile({ ...profile, name })}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Diet Type:</Text>
      <Picker
        selectedValue={profile.dietType}
        style={styles.picker}
        onValueChange={(dietType) => setProfile({ ...profile, dietType })}
      >
        <Picker.Item label="No Diet" value="" />
        <Picker.Item label="Vegan" value="Vegan" />
        <Picker.Item label="Vegetarian" value="Vegetarian" />
      </Picker>
      <Text style={styles.label}>Preferred Cuisine:</Text>
      <Picker
        selectedValue={profile.area}
        style={styles.picker}
        onValueChange={(area) => setProfile({ ...profile, area })}
      >
        <Picker.Item label="Select Area - no favorite" value="" />
        <Picker.Item label="American" value="American" />
        <Picker.Item label="British" value="British" />
        <Picker.Item label="Canadian" value="Canadian" />
        <Picker.Item label="Chinese" value="Chinese" />
        <Picker.Item label="French" value="French" />
        <Picker.Item label="Italian" value="Italian" />
        <Picker.Item label="Japanese" value="Japanese" />
        <Picker.Item label="Mexican" value="Mexican" />
        <Picker.Item label="Thai" value="Thai" />
      </Picker>
      <Text style={styles.label}>Allergies & Dislikes:</Text>
      <FlatList
        data={profile.allergies}
        renderItem={({ item }) => <Text style={styles.allergyItem}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Allergy/Dislike" onPress={() => setModalVisible(true)} color="darkred" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Save Profile" onPress={saveProfile} color="darkred" />
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Search for an ingredient"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => addAllergy(item)}>
                  <Text style={styles.ingredientItem}>{item.strIngredient}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.idIngredient}
            />
          ) : (
            <Text>No results found</Text>
          )}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  allergyItem: {
    padding: 10,
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  ingredientItem: {
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default Profile;
