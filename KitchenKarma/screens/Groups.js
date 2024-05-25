import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, Button, Alert, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Groups = () => {
  const { fridge, groups, setGroups } = useContext(AppContext);
  const [groupName, setGroupName] = useState('');
  const [dietType, setDietType] = useState('');
  const [area, setArea] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [isAllergyModalVisible, setAllergyModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

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

  const addGroup = () => {
    const newGroup = {
      name: groupName,
      dietType,
      area,
      allergies,
    };
    setGroups([...groups, newGroup]);
    setGroupName('');
    setDietType('');
    setArea('');
    setAllergies([]);
  };

  const addAllergy = (item) => {
    if (!allergies.includes(item.strIngredient)) {
      setAllergies([...allergies, item.strIngredient]);
    }
    setAllergyModalVisible(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const fetchGroupRecipes = async (group) => {
    setSelectedGroup(group);
    setModalVisible(true);

    const query = fridge.join(',');
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v2/9973533/filter.php', {
        params: { i: query },
      });
      const allRecipes = response.data.meals || [];

      const detailedRecipes = await Promise.all(
        allRecipes.map(async (recipe) => {
          const detailResponse = await axios.get('https://www.themealdb.com/api/json/v1/1/lookup.php', {
            params: { i: recipe.idMeal },
          });
          return detailResponse.data.meals[0];
        })
      );

      const filteredRecipes = detailedRecipes.filter((recipe) => {
        const recipeIngredients = getRecipeIngredients(recipe);
        const fridgeSet = new Set(fridge);

        return (
          recipeIngredients.every((ingredient) => fridgeSet.has(ingredient)) &&
          (!group.dietType || recipe.strCategory.toLowerCase() === group.dietType.toLowerCase()) &&
          (!group.area || recipe.strArea.toLowerCase() === group.area.toLowerCase()) &&
          !group.allergies.some((allergy) => recipeIngredients.includes(allergy.toLowerCase().replace(/ /g, '_')))
        );
      });

      setRecipes(filteredRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error.response ? error.response.data : error.message);
    }
  };

  const getRecipeIngredients = (recipe) => {
    return Object.keys(recipe)
      .filter(key => key.startsWith('strIngredient') && recipe[key])
      .map(key => recipe[key].toLowerCase().replace(/ /g, '_'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Group Name"
      />
      <Text style={styles.label}>Diet Type:</Text>
      <Picker
        selectedValue={dietType}
        style={styles.picker}
        onValueChange={setDietType}
      >
        <Picker.Item label="No Diet" value="" />
        <Picker.Item label="Vegan" value="Vegan" />
        <Picker.Item label="Vegetarian" value="Vegetarian" />
      </Picker>
      <Text style={styles.label}>Preferred Cuisine:</Text>
      <Picker
        selectedValue={area}
        style={styles.picker}
        onValueChange={setArea}
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
        data={allergies}
        renderItem={({ item }) => <Text style={styles.allergyItem}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Allergy/Dislike" onPress={() => setAllergyModalVisible(true)} color="darkred" />
      </View>
      <Button title="Add Group" onPress={addGroup} color="darkred" />

      <Modal isVisible={isAllergyModalVisible}>
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
          <Button title="Close" onPress={() => setAllergyModalVisible(false)} />
        </View>
      </Modal>

      <ScrollView>
        {groups && groups.length > 0 ? groups.map((group, index) => (
          <View key={index} style={styles.groupItem}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Button title="Find Recipes" onPress={() => fetchGroupRecipes(group)} />
          </View>
        )) : <Text>No groups available</Text>}
      </ScrollView>

      {selectedGroup && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Recipes for {selectedGroup.name}</Text>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {recipes && recipes.length > 0 ? recipes.map((recipe, index) => (
                  <View key={index} style={styles.recipeItem}>
                    <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
                    <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                    <Button title="View Recipe" onPress={() => alert(`View recipe details for ${recipe.strMeal}`)} />
                  </View>
                )) : <Text>No recipes found.</Text>}
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
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
  groupItem: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recipeItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  recipeImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Groups;
