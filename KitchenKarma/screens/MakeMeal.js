import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const MakeMeal = () => {
  const { fridge, profile } = useContext(AppContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fridge.length > 0) {
      fetchRecipes();
    }
  }, [fridge, profile]);

  const fetchRecipes = async () => {
    const query = fridge.join(',');
    console.log('Fetching recipes with query:', query); // Debugging log
    setLoading(true);

    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php', {
        params: {
          i: query,
          api_key: '1', // Adding the API key here
        },
      });
      console.log('API response:', response.data); // Debugging log
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error('Error fetching recipes:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Meal</Text>
      {loading && <Text>Loading...</Text>}
      {!loading && recipes.length === 0 && <Text>No recipes found. Try adding more ingredients.</Text>}
      <ScrollView>
        {recipes.map((recipe, index) => (
          <View key={index} style={styles.recipeItem}>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
            <Button
              title="View Recipe"
              onPress={() => alert(`View recipe details for ${recipe.strMeal}`)}
            />
          </View>
        ))}
      </ScrollView>
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
});

export default MakeMeal;
