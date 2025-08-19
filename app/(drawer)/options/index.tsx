import { StyledIcon } from '@/components/StyledIcon';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { useApplication } from '@/providers/ApplicationProvider';
import { router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const settingsData = [
  { id: '1', icon: 'videocam', title: 'Відео', subtitle: 'Налаштування плеєра та джерел відео' },
  { id: '3', icon: 'movie', title: 'Каталог', subtitle: 'Налаштування каталогу фільмів/серіалів' },
  { id: '4', icon: 'style', title: 'Вигляд та поведінка', subtitle: 'Тема, сортування' },
  {
    id: '5',
    icon: 'save',
    title: 'Збережені дані',
    subtitle: 'Керування збереженими даними (історія, кеш, закладки)'
  },
  {
    id: '6',
    icon: 'person',
    title: 'Профілі',
    subtitle: 'Налаштування профілів сторонніх ресурсів'
  },
  { id: '7', icon: 'block', title: 'Блокування', subtitle: '' }
];

export default function OptionsScreen() {
  const { apiBaseUrl, setApiBaseUrl } = useApplication();
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push('/options/catalog')}>
      <StyledIcon name="cog-outline" size="large" color="#fff" style={styles.icon} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <Drawer.Screen
        options={{
          headerRight: () => null,
          headerTitle: () => (
            <View style={styles.header}>
              <StyledIcon name="cog-outline" />
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Налаштування</Text>
            </View>
          )
        }}
      />

      <View style={styles.container}>
        <FlatList data={settingsData} renderItem={renderItem} keyExtractor={item => item.id} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaledPixels(10)
  },
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 10
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333'
  },
  icon: {
    marginRight: 15
  },
  textBlock: {
    flex: 1
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  subtitle: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2
  }
});
