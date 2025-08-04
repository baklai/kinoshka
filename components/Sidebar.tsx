import { CategoryProps } from '@/types/category.type';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  BackHandler,
  Pressable, // Используем Pressable вместо TouchableOpacity
  ScrollView,
  StyleSheet,
  Text,
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
  // Состояние для отслеживания сфокусированного элемента
  const [focusedItem, setFocusedItem] = useState<string | null>(null);

  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.sidebar}>
      {/* ScrollView должен быть фокусируемым, чтобы его можно было прокручивать пультом */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        focusable={true}
        // tvParallaxProperties - это пропс, который добавляет небольшую анимацию при фокусе,
        // что улучшает UX на Android TV.
        // @ts-ignore
        tvParallaxProperties={{ enabled: true }}
      >
        {categories.map(category => (
          // Используем Pressable для лучшей обработки фокуса
          <Pressable
            key={category.name}
            style={[
              styles.item,
              selectedCategory === category.name && { backgroundColor: '#333333' },
              focusedItem === `category-${category.name}` && styles.focusedItem
            ]}
            onPress={() => {
              onSelectedCategory(category.name);
              router.push('/');
            }}
            onFocus={() => setFocusedItem(`category-${category.name}`)}
            onBlur={() => setFocusedItem(null)}
          >
            <MaterialIcons
              name={category.icon || 'folder'}
              size={18}
              color="#c5c5c5"
              style={styles.icon}
            />
            <Text style={styles.itemText}>{category.description}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.section}>
          <Pressable
            style={[styles.bottomItem, focusedItem === 'history' && styles.focusedItem]}
            onPress={() => router.push('/history')}
            onFocus={() => setFocusedItem('history')}
            onBlur={() => setFocusedItem(null)}
          >
            <MaterialIcons name="history" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Історія</Text>
          </Pressable>

          <Pressable
            style={[styles.bottomItem, focusedItem === 'bookmarks' && styles.focusedItem]}
            onPress={() => router.push('/bookmarks')}
            onFocus={() => setFocusedItem('bookmarks')}
            onBlur={() => setFocusedItem(null)}
          >
            <MaterialIcons name="bookmark" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Закладки</Text>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Pressable
            style={[styles.bottomItem, focusedItem === 'settings' && styles.focusedItem]}
            onPress={() => router.push('/options')}
            onFocus={() => setFocusedItem('settings')}
            onBlur={() => setFocusedItem(null)}
          >
            <MaterialIcons name="settings" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Налаштування</Text>
          </Pressable>
          <Pressable
            style={[styles.bottomItem, focusedItem === 'about' && styles.focusedItem]}
            onPress={() => router.push('/about')}
            onFocus={() => setFocusedItem('about')}
            onBlur={() => setFocusedItem(null)}
          >
            <MaterialIcons name="info" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Про додаток</Text>
          </Pressable>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Pressable
            style={[styles.bottomItem, focusedItem === 'exit' && styles.focusedItem]}
            onPress={handleExit}
            onFocus={() => setFocusedItem('exit')}
            onBlur={() => setFocusedItem(null)}
          >
            <MaterialIcons name="exit-to-app" size={22} color="#c5c5c5" style={styles.icon} />
            <Text style={styles.itemText}>Вихід</Text>
          </Pressable>
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
    fontSize: 16,
    fontWeight: '600'
  },
  icon: {
    marginRight: 10
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
  },
  // Новый стиль для элемента в фокусе
  focusedItem: {
    borderColor: '#007bff', // Или другой цвет для выделения
    borderWidth: 2,
    borderRadius: 6,
    backgroundColor: '#444444' // Можно изменить фон
  }
});
