import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { router } from 'expo-router';
import React from 'react';
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
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push('/options')}>
      <StyledIcon
        icon="cog-outline"
        size="large"
        color={AppTheme.colors.text}
        style={styles.icon}
      />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>
        {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList data={settingsData} renderItem={renderItem} keyExtractor={item => item.id} />
    </View>
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
    padding: scaledPixels(10)
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaledPixels(12),
    borderBottomWidth: scaledPixels(0.5),
    borderBottomColor: AppTheme.colors.border
  },
  icon: {
    marginRight: scaledPixels(15)
  },
  textBlock: {
    flex: 1
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: scaledPixels(16),
    fontWeight: '600'
  },
  subtitle: {
    color: AppTheme.colors.subtext,
    fontSize: scaledPixels(13),
    marginTop: scaledPixels(2)
  }
});
