import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const MakeMeal = () => {
  const { fridge } = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (fridge.length > 0) {
      fetchRecipes();
    }
  }, [fridge]);

  const fetchRecipes = async () => {
    setLoading(true);

    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v2/9973533/latest.php');
      const allRecipes = response.data.meals;

      const filteredRecipes = allRecipes.filter(recipe => {
        const recipeIngredients = getRecipeIngredients(recipe);
        return recipeIngredients.every(ingredient => 
          fridge.includes(ingredient)
        );
      });

      setRecipes(filteredRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeIngredients = (recipe) => {
    return Object.keys(recipe)
      .filter(key => key.startsWith('strIngredient') && recipe[key])
      .map(key => recipe[key].toLowerCase().replace(/ /g, '_'));
  };

  const viewRecipeDetail = (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const cookRecipe = () => {
    if (selectedRecipe) {
      const recipeIngredients = getRecipeIngredients(selectedRecipe);
      // We assume that all the ingredients are removed when the recipe is cooked
      const updatedFridge = fridge.filter(item => !recipeIngredients.includes(item));
      setFridge(updatedFridge);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Meal</Text>
      {loading && <Text>Loading...</Text>}
      {!loading && recipes.length === 0 && <Text>No recipes found. Try adding more ingredients.</Text>}
      <ScrollView>
        {recipes.map((recipe, index) => (
          <TouchableOpacity key={index} style={styles.recipeItem} onPress={() => viewRecipeDetail(recipe)}>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedRecipe && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.modalTitle}>{selectedRecipe.strMeal}</Text>
                <Image source={{ uri: selectedRecipe.strMealThumb }} style={styles.modalImage} />
                <Text style={styles.modalSectionTitle}>Ingredients:</Text>
                {Object.keys(selectedRecipe)
                  .filter(key => key.startsWith('strIngredient') && selectedRecipe[key])
                  .map((key, index) => (
                    <Text key={index} style={styles.ingredient}>
                      {selectedRecipe[key]} - {selectedRecipe[`strMeasure${key.match(/\d+/)[0]}`]}
                    </Text>
                  ))}
                <Text style={styles.modalSectionTitle}>Instructions:</Text>
                <Text style={styles.instructions}>{selectedRecipe.strInstructions}</Text>
                <Button title="Cook" onPress={cookRecipe} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  scrollContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default MakeMeal;