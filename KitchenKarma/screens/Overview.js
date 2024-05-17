import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/list.php',
      params: { i: 'list' },
    };

    try {
      const response = await axios.request(options);
      const sortedData = response.data.meals.sort((a, b) => a.strIngredient.localeCompare(b.strIngredient));
      setData(sortedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          data ? data.map((ingredient, index) => (
            <View key={index} style={styles.ingredientContainer}>
              <Text style={styles.ingredientName}>{ingredient.strIngredient}</Text>
            </View>
          )) : (
            <Text>No data available</Text>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  ingredientContainer: {
    marginBottom: 10,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
  },
  ingredientName: {
    fontSize: 16,
  },
});

export default Overview;
