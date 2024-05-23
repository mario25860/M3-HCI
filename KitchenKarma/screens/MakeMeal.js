import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the close icon
import axios from 'axios';

const MakeMeal = () => {
  const [recipes, setRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async () => {
    const appId = '072216c5';  // Your Edamam App ID
    const appKey = '4267bec91917e8a08ed394400ff69fae';  // Your Edamam App Key

    try {
      setLoading(true);
      const response = await axios.get('https://api.edamam.com/api/recipes/v2', {
        params: {
          type: 'public',
          q: '', // Empty query to get general recipes
          app_id: appId,
          app_key: appKey,
          from: 0,
          to: 20, // Number of recipes to fetch
          imageSize: 'REGULAR'
        }
      });

      if (response.data.hits) {
        const recipesData = response.data.hits.map(hit => ({
          id: hit.recipe.uri,
          name: hit.recipe.label,
          imageUrl: hit.recipe.image,
          source: hit.recipe.source,
          ingredients: hit.recipe.ingredientLines,
        }));
        setRecipes(recipesData);
      } else {
        setRecipes([]);
      }

      setLoading(false);
      setShowRecipes(true);
    } catch (error) {
      console.error('Error fetching recipes:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowRecipes(false);
    setRecipes([]);
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.recipeImage}
      />
      <View style={styles.recipeTextContainer}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeSource}>Source: {item.source}</Text>
        <Text style={styles.recipeIngredients}>Ingredients:</Text>
        {item.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientItem}>{ingredient}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Make a Meal</Text>
        <Button title="Fetch Recipes" onPress={fetchRecipes} />

        <Modal
          animationType="slide"
          transparent={false}
          visible={showRecipes}
          onRequestClose={closeModal}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close-circle-outline" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.recipesTitle}>Recipes:</Text>
              {loading && <Text>Loading...</Text>}
              {!loading && (
                <FlatList
                  data={recipes}
                  renderItem={renderRecipeItem}
                  keyExtractor={item => item.id}
                />
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  recipesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  recipeImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  recipeTextContainer: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeSource: {
    fontSize: 12,
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ingredientItem: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default MakeMeal;
