import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MakeMeal = () => {
  return (
    <View style={styles.container}>
      <Text>Make Meal Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MakeMeal;
