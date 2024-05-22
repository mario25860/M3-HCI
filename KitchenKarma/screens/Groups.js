import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';

const Groups = () => {
    
  const groups = [
    { id: 1, name: 'Group 1', members: [{ name: 'John', preferences: ['Vegan', 'Low Calorie'] }, { name: 'Doe', preferences: ['Vegetarian'] }] },
    { id: 2, name: 'Group 2', members: [{ name: 'Jane', preferences: ['Low Carb'] }, { name: 'Smith', preferences: ['Vegetarian'] }] },
    { id: 3, name: 'Group 3', members: [{ name: 'Emma', preferences: ['Vegan', 'Low Calorie'] }, { name: 'Johnson', preferences: ['Low Carb'] }] },
    { id: 4, name: 'Group 4', members: [{ name: 'Sarah', preferences: ['Vegetarian', 'Low Calorie'] }, { name: 'Brown', preferences: ['Low Carb'] }] },
  ];

  const [selectedGroup, setSelectedGroup] = useState(null);

  const selectGroup = (group) => {
    setSelectedGroup(group);
  };

  const closeModal = () => {
    setSelectedGroup(null);
  };


  const generateRecipe = () => {

    console.log('Generating recipe for group:', selectedGroup.name);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <View style={styles.groupsContainer}>
        {groups.map(group => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupItem}
            onPress={() => selectGroup(group)}
          >
            <Text style={styles.groupName}>{group.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={!!selectedGroup}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedGroup?.name}</Text>
          <Text style={styles.membersTitle}>Members:</Text>
          {selectedGroup?.members.map((member, index) => (
            <View key={index}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.preferences}>{member.preferences.join(', ')}</Text>
            </View>
          ))}
          <Button title="Generate Recipe for Group" onPress={generateRecipe} />
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  groupItem: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    margin: 10,
    borderRadius: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  membersTitle: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 10,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  preferences: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Groups;
