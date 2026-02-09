import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recetas en General</Text>
      <Text style={styles.subtext}>Proximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtext: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 8,
  },
});
