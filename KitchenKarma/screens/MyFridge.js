import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import _ from 'lodash';

const MyFridge = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fridge, setFridge] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      const debouncedSearch = _.debounce(searchIngredients, 300);
      debouncedSearch();
      return () => {
        debouncedSearch.cancel();
      };
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const searchIngredients = async () => {
    const appId = 'cdb3e1e2';  
    const appKey = 'd9a48b57153cfa818fb32ff3339dc2f2'; 

    try {
      const response = await axios.get('https://api.edamam.com/api/food-database/v2/parser', {
        params: {
          ingr: query,
          app_id: appId,
          app_key: appKey
        }
      });
      setSearchResults(response.data.hints);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };

  const addToFridge = (ingredient) => {
    if (quantity.trim() === '') {
      alert('Please enter a quantity');
      return;
    }
    setFridge([...fridge, { ...ingredient, quantity }]);
    setQuantity('');
    setQuery('');
    setSearchResults([]);
  };

  const fetchRecipes = async () => {
    const appId = '072216c5';  
    const appKey = '4267bec91917e8a08ed394400ff69fae';  
    
    try {
      setLoading(true);
      const ingredientsQuery = fridge.map(item => item.food).join(',');
      const response = await axios.get('https://api.edamam.com/search', {
        params: {
          q: ingredientsQuery,
          app_id: appId,
          app_key: appKey,
          ingr: fridge.length  
        }
      });

      const filteredRecipes = response.data.hits.filter(hit => {
        const recipeIngredients = hit.recipe.ingredients.map(i => i.food ? i.food.toLowerCase() : '').filter(Boolean);
        return fridge.every(f => f.food && recipeIngredients.includes(f.food.toLowerCase()));
      });

      setRecipes(filteredRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Search Ingredients:</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Enter ingredient name"
        />

        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.label}>Search Results:</Text>
            {searchResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text>{result.food.label}</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Enter quantity"
                />
                <Button title="Add to Fridge" onPress={() => addToFridge(result.food)} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.fridgeContainer}>
          <Text style={styles.label}>Fridge Contents:</Text>
          {fridge.map((item, index) => (
            <View key={index} style={styles.fridgeItem}>
              <Text>{item.label} - {item.quantity}</Text>
            </View>
          ))}
        </View>

        <Button title="Search Recipes" onPress={fetchRecipes} />

        {loading && <Text>Loading...</Text>}

        {!loading && recipes.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.label}>Recipes:</Text>
            {recipes.map((recipe, index) => (
              <View key={index} style={styles.resultItem}>
                <Text>{recipe.recipe.label}</Text>
                <Text>{recipe.recipe.ingredientLines.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}
        {!loading && recipes.length === 0 && (
          <Text>No recipes found. Try adding more ingredients or fetching again.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultItem: {
    marginBottom: 15,
  },
  fridgeContainer: {
    marginTop: 20,
  },
  fridgeItem: {
    marginBottom: 10,
  },
});

export default MyFridge;
