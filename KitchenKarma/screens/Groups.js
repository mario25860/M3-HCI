import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Image } from 'react-native';

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [preferences, setPreferences] = useState('Vegetarian');

  const groups = [
    { id: 1, name: 'Group 1', members: [{ name: 'John', preferences: ['no preferences'] }, { name: 'Doe', preferences: ['Vegetarian'] }] },
    // weitere Gruppen hier
  ];

  const selectGroup = (group) => {
    setSelectedGroup(group);
    setShowRecipes(false); // Rezepte zurücksetzen, wenn eine neue Gruppe ausgewählt wird
  };

  const generateRecipes = async () => {
    if (!selectedGroup || !selectedGroup.members) {
      return;
    }
  
    const hasPreference = (member, preference) => member.preferences.includes(preference);
  
    const hasVegetarianRecipes = selectedGroup.members.some(member => hasPreference(member, preferences));
    if (!hasVegetarianRecipes) {
      return;
    }
  
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${preferences}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${preferences} recipes`);
      }
  
      const data = await response.json();
      if (!data.meals || data.meals.length === 0) {
        throw new Error(`No ${preferences} recipes found`);
      }
  
      const recipesData = data.meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        imageUrl: meal.strMealThumb
      }));
  
      setRecipes(recipesData);
      setShowRecipes(true); // Rezepte anzeigen, nachdem sie generiert wurden
    } catch (error) {
      console.error('Error generating recipes:', error.message);
    }
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setRecipes([]);
    setShowRecipes(false);
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
        visible={!!selectedGroup && !showRecipes}
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
          <Button title="Generate Recipes" onPress={generateRecipes} />
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showRecipes}
        onRequestClose={() => setShowRecipes(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.recipesTitle}>Recipes:</Text>
          <ScrollView>
            {recipes.map(recipe => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeItem}
                onPress={() => {/* Hier kannst du die Aktion definieren, die beim Tippen auf ein Rezept ausgeführt werden soll */}}
              >
                <Image
                  source={{ uri: recipe.imageUrl }}
                  style={styles.recipeImage}
                />
                <Text style={styles.recipeName}>{recipe.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button title="Close" onPress={() => setShowRecipes(false)} />
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
    backgroundColor: '#fff', // Hintergrundfarbe für Modal
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
  recipesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  recipeImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  recipeName: {
    fontSize: 16,
  },
});

export default Groups;
