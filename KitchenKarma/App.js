import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Here are C!</Text>
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
});
