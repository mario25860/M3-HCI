import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const MyFridge = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { fridge, setFridge } = useContext(AppContext);

  useEffect(() => {
    fetchAllIngredients();
  }, []);

  const fetchAllIngredients = async () => {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v2/9973533/list.php?i=list');
      const ingredients = response.data.meals.map(meal => meal.strIngredient);
      setSearchResults(ingredients);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };

  const searchIngredients = async (query) => {
    if (query.trim() === '') {
      fetchAllIngredients();
      return;
    }

    const filteredIngredients = searchResults.filter(ingredient =>
      ingredient.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredIngredients);
  };

  const addToFridge = (ingredient) => {
    const formattedIngredient = ingredient.toLowerCase().replace(/ /g, '_');
    if (!fridge.includes(formattedIngredient)) {
      setFridge([...fridge, formattedIngredient]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Fridge</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          searchIngredients(text);
        }}
        placeholder="Enter ingredient name"
      />

      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((result, index) => (
          <TouchableOpacity key={index} style={styles.resultItem} onPress={() => addToFridge(result)}>
            <Text>{result}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.fridgeTitle}>Fridge Contents:</Text>
      <ScrollView style={styles.fridgeContainer}>
        {fridge.map((item, index) => (
          <View key={index} style={styles.fridgeItem}>
            <Text>{item.replace(/_/g, ' ')}</Text>
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
    backgroundColor: '#fff',
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
  resultsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  fridgeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fridgeContainer: {
    flex: 1,
  },
  fridgeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MyFridge;
