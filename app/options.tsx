import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function OptionsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: true,
          headerSearchBarOptions: undefined,
          headerTitle: () => (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Налаштування</Text>
            </View>
          )
        }}
      />

      <View style={styles.container}>
        <Text>Налаштування</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 4,
    gap: 4
  }
});
