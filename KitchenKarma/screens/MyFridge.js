// src/screens/MyFridge.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import _ from 'lodash';
import { AppContext } from '../context/AppContext';

const MyFridge = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { fridge, setFridge } = useContext(AppContext);

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
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
      const ingredients = response.data.meals.map(meal => meal.strIngredient);
      const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredIngredients);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };

  const addToFridge = (ingredient) => {
    const formattedIngredient = ingredient.toLowerCase().replace(/ /g, '_');
    if (!fridge.includes(formattedIngredient)) {
      setFridge([...fridge, formattedIngredient]);
    }
    setQuery('');
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Fridge</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Enter ingredient name"
      />

      {searchResults.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          {searchResults.map((result, index) => (
            <TouchableOpacity key={index} style={styles.resultItem} onPress={() => addToFridge(result)}>
              <Text>{result}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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
