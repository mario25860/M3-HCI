import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Profile = () => {
  const [name, setName] = useState('');
  const [preference, setPreference] = useState('');
  const [area, setArea] = useState('');
  const [allergies, setAllergies] = useState('');

  const saveProfile = () => {
    Alert.alert('Profile Saved', `Name: ${name}\nPreference: ${preference}\nArea: ${area}\nAllergies: ${allergies}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Preference (Diet Type):</Text>
      <TextInput
        style={styles.input}
        value={preference}
        onChangeText={setPreference}
        placeholder="Enter your diet preference"
      />
      <Text style={styles.label}>Preferred Cuisine (Area):</Text>
      <Picker
        selectedValue={area}
        style={styles.picker}
        onValueChange={(itemValue) => setArea(itemValue)}
      >
        <Picker.Item label="Select Area" value="" />
        <Picker.Item label="American" value="American" />
        <Picker.Item label="British" value="British" />
        <Picker.Item label="Canadian" value="Canadian" />
        <Picker.Item label="Chinese" value="Chinese" />
        <Picker.Item label="French" value="French" />
        <Picker.Item label="Italian" value="Italian" />
        <Picker.Item label="Japanese" value="Japanese" />
        <Picker.Item label="Mexican" value="Mexican" />
        <Picker.Item label="Thai" value="Thai" />
        {/* Weitere Bereiche hinzufügen */}
      </Picker>
      <Text style={styles.label}>Allergies:</Text>
      <TextInput
        style={styles.input}
        value={allergies}
        onChangeText={setAllergies}
        placeholder="Enter your allergies"
      />
      <Button title="Save Profile" onPress={saveProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Profile;
