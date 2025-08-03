import KinoshkaImage from '@/assets/images/kinoshka.png';
import { CategoryProps } from '@/types/category.type';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SidebarProps {
  categories: CategoryProps[];
  selectedCategory: string;
  onSelectedCategory: (name: string) => void;
}

export default function Sidebar({
  categories,
  selectedCategory,
  onSelectedCategory
}: SidebarProps) {
  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.topContainer}>
        <Image source={KinoshkaImage} style={{ width: 280, height: 50, resizeMode: 'stretch' }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.item,
              selectedCategory === category.name && { backgroundColor: '#333333' }
            ]}
            onPress={() => {
              onSelectedCategory(category.name);
              router.push('/');
            }}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name={category.icon || 'folder'}
              size={18}
              color="#c5c5c5"
              style={styles.icon}
            />
            <Text style={styles.itemText}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.6}
            onPress={() => router.push('/history')}
          >
            <MaterialIcons name="history" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Історія</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.6}
            onPress={() => router.push('/bookmarks')}
          >
            <MaterialIcons name="bookmark" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Закладки</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.6}
            onPress={() => router.push('/options')}
          >
            <MaterialIcons name="settings" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Налаштування</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomItem}
            activeOpacity={0.6}
            onPress={() => router.push('/about')}
          >
            <MaterialIcons name="info" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Про додаток</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <TouchableOpacity style={styles.bottomItem} activeOpacity={0.6} onPress={handleExit}>
            <MaterialIcons name="exit-to-app" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Вихід</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 300,
    minWidth: 300,
    maxWidth: 300,
    backgroundColor: '#252526',
    borderRightWidth: 1,
    borderRightColor: '#272729',
    justifyContent: 'space-between'
  },
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 100
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 600
  },
  icon: {
    marginRight: 10
  },
  topContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  bottomContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  section: {
    marginBottom: 10
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  separator: {
    height: 1,
    marginVertical: 5,
    backgroundColor: '#333333'
  }
});
