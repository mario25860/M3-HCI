import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [noRecipesFound, setNoRecipesFound] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);

  //GROUPS
  const groups = [
    {
      id: 1,
      name: 'Familie',
      image: 'https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      members: [
        { name: 'John', diet: ['balanced'], health: ['vegan'] },
        { name: 'Doe', diet: ['balanced'], health: ['peanut-free'] }
      ]
    },
    {
      id: 2,
      name: 'WG',
      image: 'https://images.pexels.com/photos/1255061/pexels-photo-1255061.jpeg?auto=compress&cs=tinysrgb&w=300',
      members: [
        { name: 'Bea', diet: ['balanced'], health: ['dairy-free'] },
        { name: 'Amir', diet: ['balanced'], health: ['pork-free'] },
        { name: 'Jane', diet: ['high-protein'], health: [] }
      ]
    },
    {
      id: 3,
      name: 'Urlaub',
      image: 'https://images.pexels.com/photos/276334/pexels-photo-276334.jpeg?auto=compress&cs=tinysrgb&w=300',
      members: [
        { name: 'Max', diet: ['balanced'], health: ['vegan'] },
        { name: 'Amy', diet: ['high-protein'], health: ['peanut-free'] }
      ]
    },
    {
      id: 4,
      name: 'dieBesten',
      image: 'https://images.pexels.com/photos/1587510/pexels-photo-1587510.jpeg?auto=compress&cs=tinysrgb&w=300',
      members: [
        { name: 'Theo', diet: ['low-sodium'], health: ['soy-free'] },
        { name: 'Vanessa', diet: ['low-fat'], health: ['sugar-conscious'] }
      ]
    },
  ];

  const selectGroup = (group) => {
    setSelectedGroup(group);
    setShowRecipes(false);
  };
//filter for recipes for group preferences
  const generateRecipeQuery = (dietPreferences, healthPreferences) => {
    let query = 'https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=072216c5&app_key=4267bec91917e8a08ed394400ff69fae';

    dietPreferences.forEach(pref => {
      query += `&diet=${encodeURIComponent(pref)}`;
    });

    healthPreferences.forEach(pref => {
      query += `&health=${encodeURIComponent(pref)}`;
    });

    query += '&imageSize=REGULAR';
    return query;
  };

  const fetchRecipes = async () => {
    if (!selectedGroup || !selectedGroup.members) {
      return;
    }

    const dietPreferences = new Set();
    const healthPreferences = new Set();

    selectedGroup.members.forEach(member => {
      member.diet.forEach(pref => dietPreferences.add(pref));
      member.health.forEach(pref => healthPreferences.add(pref));
    });

    try {
      const query = generateRecipeQuery(Array.from(dietPreferences), Array.from(healthPreferences));
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      if (!data.hits || data.hits.length === 0) {
        setNoRecipesFound(true);
        setShowRecipes(true);
        return;
      }

      //recipe data saved
      const recipesData = data.hits.map(hit => ({
        id: hit.recipe.uri,
        name: hit.recipe.label,
        imageUrl: hit.recipe.image,
        source: hit.recipe.source,
      }));

      setRecipes(recipesData);
      setShowRecipes(true);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      setNoRecipesFound(true);
    }
  };

  const fetchRecipeDetails = async (recipeUri) => {
    const baseLink = 'https://api.edamam.com/api/recipes/v2';
    const recipeId = recipeUri.split('#recipe_')[1];
    const query = `${baseLink}/${recipeId}?type=public&beta=true&app_id=072216c5&app_key=4267bec91917e8a08ed394400ff69fae`;

    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details');
      }
      const data = await response.json();
      setRecipeDetails(data.recipe);
    } catch (error) {
      console.error('Error fetching recipe details:', error.message);
    }
  };

  const handleRecipePress = (recipe) => {
    console.log(recipe);
    setSelectedRecipe(recipe);
    fetchRecipeDetails(recipe.id);
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setRecipes([]);
    setShowRecipes(false);
    setNoRecipesFound(false);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
    setRecipeDetails(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Groups</Text>
        <View style={styles.groupsContainer}>
          {groups.map(group => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupItem}
              onPress={() => selectGroup(group)}
            >
              <Image
                source={{ uri: group.image }}
                style={styles.groupImage}
              />
              <Text style={styles.groupName}>{group.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedGroup && !showRecipes}
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close-circle-outline" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedGroup?.name}</Text>
              <ScrollView style={styles.membersList}>
                {selectedGroup?.members.map((member, index) => (
                  <View key={index} style={styles.memberItem}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.preferencesContainer}>
                      {member.health.length > 0 && <Text style={styles.preferences}>Health: {member.health.join(', ')}</Text>}
                      {member.diet.length > 0 && <Text style={styles.preferences}>Diet: {member.diet.join(', ')}</Text>}
                    </View>
                  </View>
                ))}
              </ScrollView>
              <Button title="Generate Recipes" onPress={fetchRecipes} />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={showRecipes}
          onRequestClose={() => setShowRecipes(false)}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowRecipes(false)}>
                <Ionicons name="close-circle-outline" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.recipesTitle}>Recipes:</Text>
              <ScrollView>
                {noRecipesFound ? (
                  <Text style={styles.noRecipesText}>No recipes found for the selected preferences.</Text>
                ) : (
                  recipes.map(recipe => (
                    <TouchableOpacity
                      key={recipe.id}
                      style={styles.recipeItem}
                      onPress={() => handleRecipePress(recipe)}
                    >
                      <Image
                        source={{ uri: recipe.imageUrl }}
                        style={styles.recipeImage}
                      />
                      <View>
                        <Text style={styles.recipeName}>{recipe.name}</Text>
                        <Text style={styles.recipeSource}>Source: {recipe.source}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
              <Button title="Close" onPress={() => setShowRecipes(false)} />
            </View>
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={!!selectedRecipe && !!recipeDetails}
          onRequestClose={closeRecipeModal}
        >
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
              <TouchableOpacity style={styles.closeButton} onPress={closeRecipeModal}>
                <Ionicons name="close-circle-outline" size={30} color="#000" />
              </TouchableOpacity>
              {recipeDetails && (
                <View>
                  <Text style={styles.recipeDetailTitle}>{recipeDetails.label}</Text>
                  <Image source={{ uri: recipeDetails.image }} style={styles.recipeDetailImage} />
                  <Text style={styles.recipeDetailSource}>Source: {recipeDetails.source}</Text>
                  <Text style={styles.recipeDetailSectionTitle}>Ingredients:</Text>
                  {recipeDetails.ingredientLines.map((line, index) => (
                    <Text key={index} style={styles.recipeDetailIngredient}>{line}</Text>
                  ))}
                  <Text style={styles.recipeDetailSectionTitle}>Instructions:</Text>
                  <Text style={styles.recipeDetailInstructions}>Visit <Text style={styles.recipeDetailLink}>{recipeDetails.url}</Text> for the full instructions.</Text>
                </View>
              )}
            </ScrollView>
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
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  groupItem: {
    width: 140,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  membersList: {
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  memberName: {
    fontSize: 16,
    flex: 1,
  },
  preferencesContainer: {
    flex: 2,
    marginLeft: 10,
  },
  preferences: {
    fontSize: 14,
  },
  recipesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  recipeImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeSource: {
    fontSize: 12,
  },
  noRecipesText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  recipeDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  recipeDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  recipeDetailSource: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  recipeDetailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  recipeDetailIngredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  recipeDetailInstructions: {
    fontSize: 16,
    marginBottom: 10,
  },
  recipeDetailLink: {
    color: '#007BFF',
  },
});

export default Groups;
