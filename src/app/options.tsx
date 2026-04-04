import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TVFocusGuideView,
  View
} from 'react-native';

import { StyledIcon } from '@/components/StyledIcon';
import { PLAYERS } from '@/constants/players.constant';
import { AppTheme } from '@/constants/ui.constant';
import { useAppContext } from '@/hooks/useAppContext';
import { SERVICES } from '@/services';
import { IconType } from '@/types/icons.type';

export default function OptionsScreen() {
  const {
    player,
    service,
    bookmarks,
    setService,
    setPlayer,
    clearBookmarks,
    clearHistory,
    clearSearch
  } = useAppContext();

  const handleClearBookmarks = () =>
    Alert.alert(
      'Очистити закладки?',
      'Всі збережені закладки буде видалено. Цю дію неможливо скасувати.',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Очистити',
          style: 'destructive',
          onPress: () => clearBookmarks()
        }
      ]
    );

  const handleClearHistory = () =>
    Alert.alert(
      'Очистити історію?',
      'Всю історію перегляду буде видалено. Цю дію неможливо скасувати.',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Очистити',
          style: 'destructive',
          onPress: () => clearHistory()
        }
      ]
    );

  const handleClearSearch = () =>
    Alert.alert(
      'Очистити пошук?',
      'Всю історію пошуку буде видалено. Цю дію неможливо скасувати.',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Очистити',
          style: 'destructive',
          onPress: () => clearSearch()
        }
      ]
    );

  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.sectionLabel}>Збережені дані</Text>

          <Pressable
            focusable
            onPress={handleClearBookmarks}
            style={({ focused }) => [styles.row, focused && styles.rowFocused]}
          >
            <StyledIcon icon="bookmark-multiple-outline" size="large" style={styles.rowIcon} />
            <View style={styles.rowBody}>
              <Text style={styles.rowText}>Закладки</Text>
              <Text style={styles.rowSubText}>{`${bookmarks.length} збережених фільмів`}</Text>
            </View>
          </Pressable>

          <Pressable
            focusable
            onPress={handleClearHistory}
            style={({ focused }) => [styles.row, focused && styles.rowFocused]}
          >
            <StyledIcon icon="history" size="large" style={styles.rowIcon} />
            <View style={styles.rowBody}>
              <Text style={styles.rowText}>Історія перегляду</Text>
              <Text style={styles.rowSubText}>Записи про переглянуті фільми</Text>
            </View>
          </Pressable>

          <Pressable
            focusable
            onPress={handleClearSearch}
            style={({ focused }) => [styles.row, focused && styles.rowFocused]}
          >
            <StyledIcon icon="magnify" size="large" style={styles.rowIcon} />
            <View style={styles.rowBody}>
              <Text style={styles.rowText}>Історія пошуку</Text>
              <Text style={styles.rowSubText}>Записи про пошукові запити</Text>
            </View>
          </Pressable>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Джерело відео</Text>
          {Object.values(SERVICES).map(s => {
            const isSelected = s.key === service;
            return (
              <Pressable
                key={s.key}
                focusable
                onPress={() => setService(s.key)}
                style={({ focused }) => [styles.row, focused && styles.rowFocused]}
              >
                <StyledIcon
                  icon={(isSelected ? 'radiobox-marked' : 'radiobox-blank') as IconType}
                  size="large"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowText}>{s.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <View>
          <Text style={styles.sectionLabel}>Відтворення відео</Text>
          {Object.values(PLAYERS).map(p => {
            const isSelected = p.key === player;
            return (
              <Pressable
                key={p.key}
                focusable
                onPress={() => setPlayer(p.key)}
                style={({ focused }) => [styles.row, focused && styles.rowFocused]}
              >
                <StyledIcon
                  icon={(isSelected ? 'radiobox-marked' : 'radiobox-blank') as IconType}
                  size="large"
                  style={styles.rowIcon}
                />
                <Text style={styles.rowText}>{p.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </TVFocusGuideView>
  );
}

const { spacing, typography } = AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(1)
  },
  scrollContent: {
    gap: spacing(2)
  },
  sectionLabel: {
    color: AppTheme.colors.subtext,
    fontSize: typography.md,
    marginBottom: spacing(1),
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(1.25),
    paddingHorizontal: spacing(1.25),
    borderRadius: 4
  },
  rowFocused: {
    opacity: 0.8,
    backgroundColor: AppTheme.colors.muted
  },
  rowIcon: {
    marginRight: spacing(1.25)
  },
  rowBody: {
    flex: 1,
    flexDirection: 'column'
  },
  rowText: {
    color: AppTheme.colors.text,
    fontSize: typography.xl
  },
  rowSubText: {
    color: AppTheme.colors.subtext,
    fontSize: typography.md,
    marginTop: spacing(0.25)
  }
});
