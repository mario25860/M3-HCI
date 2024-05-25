import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useProfile } from '../screens/ProfileContext';
import ProfileForm from '../screens/Profile';

const ProfileConfirmation = ({ navigation }) => {
  const { profile } = useProfile();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSaveData = () => {
    // Hier kannst du die Daten speichern
    // Navigiere zum ProfileSaved Bildschirm
    setModalVisible(true);
  };

  const handleEditProfile = () => {
    // Navigiere zurück zum ProfileForm Bildschirm
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Check your data</Text>
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
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Your account has been created!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('ProfileSaved');
              }}
            >
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  nameText: {
    fontSize: 28,
    color: '#666',
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
  saveButton: {
    backgroundColor: '#5C7AEA',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  closeButton: {
    backgroundColor: "#5C7AEA",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default ProfileConfirmation;
