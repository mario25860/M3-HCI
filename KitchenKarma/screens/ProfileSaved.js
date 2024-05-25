import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useProfile } from '../screens/ProfileContext';
import ProfileForm from '../screens/Profile';

const ProfileDisplayScreen = ({ navigation }) => {
  const { profile } = useProfile();

  const handleNavigateToProfile = () => {
    console.log("sign up pressed");
    navigation.navigate('Profile'); // Hier wird zum Profilbildschirm navigiert
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        {profile && <Text style={styles.nameText}>{profile.name}</Text>}
      </View>

      {profile ? (
        <>
          <View style={styles.preferenceContainer}>
            {(profile.selectedDiet || profile.selectedHealth || profile.selectedCuisine) ? (
              <>
                <View style={styles.preferenceItem}>
                  <Text style={styles.label}>Diet:</Text>
                  <Text style={styles.text}>{profile.selectedDiet || 'No specific diet'}</Text>
                </View>

                <View style={styles.preferenceItem}>
                  <Text style={styles.label}>Health:</Text>
                  <Text style={styles.text}>{profile.selectedHealth || 'No specific restrictions'}</Text>
                </View>

                <View style={styles.preferenceItem}>
                  <Text style={styles.label}>Cuisine:</Text>
                  <Text style={styles.text}>{profile.selectedCuisine || 'No specific cuisine'}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.text}>No specific</Text>
            )}
          </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleNavigateToProfile}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60, // Hier haben wir marginBottom angepasst
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    top: 20,
  },
  nameText: {
    fontSize: 28,
    color: '#666',
    top: 20,
  },
  preferenceContainer: {},
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 20,
    color: '#666',
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
});

export default ProfileDisplayScreen;
