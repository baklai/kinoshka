import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Цього екрана не існує.</Text>
      <Link href="/" style={styles.link}>
        <Text>Перейдіть на головний екран!</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 600
  },
  link: {
    marginTop: 15,
    paddingVertical: 15
  }
});
