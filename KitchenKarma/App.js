import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';

/*
Startscreen:
Profil ausfüllen und Präferenzen

-> Overview:
MyFridge -> neuer Screen der Zutaten - wählbar und Rezept generieren - hinzufügen der Lebensmittel mit Suchpunktion

Gruppe -> Gruppen anlegen mit Präferenzen und wählbar

-> Make Meal:
Rezepte generieren ohne bestimmte Lebensmittel

-> Profil:
Profil anpassen wie am Anfang
*/

//teste Zugriff auf API!!!
//https://www.themealdb.com/api.php

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/search.php',
      params: { s: 'Arrabiata' },  // Example query for "Arrabiata"
    };

    try {
      const response = await axios.request(options);
      setData(response.data.meals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          data ? data.map((meal, index) => (
            <View key={index} style={styles.recipeContainer}>
              <Text style={styles.recipeTitle}>{meal.strMeal}</Text>
              <Text>{meal.strInstructions}</Text>
            </View>
          )) : (
            <Text>No data available</Text>
          )
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

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
  recipeContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    width: '90%',
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});
