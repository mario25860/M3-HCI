import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const RecipeDetail = ({ route }) => {
  const { recipe } = route.params;

  const getRecipeIngredients = (recipe) => {
    return Object.keys(recipe)
      .filter(key => key.startsWith('strIngredient') && recipe[key])
      .map(key => recipe[key]);
  };

  const ingredients = getRecipeIngredients(recipe);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.ingredient}>{ingredient}</Text>
      ))}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
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
  },
});

export default RecipeDetail;
