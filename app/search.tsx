import SpeechButton from '@/components/SpeechButton';
import { KEYBOARD, LanguageCode } from '@/constants/keyboard.constant';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import * as Localization from 'expo-localization';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const suggestions = [
  'soda pop',
  'kirby air riders',
  'squid game',
  'spongebob squarepants full e...',
  'not enough nelsons',
  'ssundee',
  'lego batman',
  'kountry wayne',
  'pink pony club',
  'mrs rachel'
];

export default function YouTubeTVSearch() {
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState<LanguageCode>(() => {
    const [{ languageCode }] = Localization.getLocales();
    const systemLang = languageCode ? languageCode.toUpperCase() : 'EN';

    const mapLang = (code: string): LanguageCode => {
      switch (code) {
        case 'EN':
          return 'EN';
        case 'UK':
          return 'UA';
        case 'RU':
          return 'RU';
        default:
          return 'EN';
      }
    };

    return mapLang(systemLang);
  });

  const handleKeyPress = (key: string) => {
    if (key === 'SPACE') setQuery(prev => prev + ' ');
    else if (key === 'CLEAR') setQuery('');
    else if (key === 'SEARCH') console.log('Поиск:', query);
    else setQuery(prev => prev + key);
  };

  const switchLang = () => {
    if (lang === 'UA') setLang('RU');
    else if (lang === 'RU') setLang('EN');
    else if (lang === 'EN') setLang('UA');
  };

  const toggleNum = () => {
    setLang(lang === 'NUM' ? 'UA' : 'NUM');
  };

  const handleMicrophone = () => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SpeechButton onPress={handleMicrophone} />
        <View style={styles.searchBarInput}>
          <Text style={styles.searchBarInputPlaceholder}>{query || 'Пошук...'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={({ focused }) => [styles.suggestion, focused && styles.focusedSuggestion]}
              onPress={() => setQuery(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </Pressable>
          )}
        />

        <View style={styles.keyboardContainer}>
          {KEYBOARD[lang].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map(key => (
                <Pressable
                  key={key}
                  onPress={() => handleKeyPress(key)}
                  style={({ focused }) => [styles.key, focused && styles.focusedKey]}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.keyboardRow}>
            <Pressable
              onPress={() => handleKeyPress('SPACE')}
              style={({ focused }) => [styles.keyWide, focused && styles.focusedKey]}
            >
              <Text style={styles.keyText}>SPACE</Text>
            </Pressable>

            <Pressable
              onPress={() => handleKeyPress('CLEAR')}
              style={({ focused }) => [styles.keyWide, focused && styles.focusedKey]}
            >
              <Text style={styles.keyText}>CLEAR</Text>
            </Pressable>

            <Pressable
              onPress={() => handleKeyPress('SEARCH')}
              style={({ focused }) => [styles.keyWide, focused && styles.focusedKey]}
            >
              <Text style={styles.keyText}>SEARCH</Text>
            </Pressable>
          </View>

          <View style={styles.sideButtons}>
            <Pressable
              style={({ focused }) => [styles.sideBtn, focused && styles.focusedSideBtn]}
              onPress={switchLang}
            >
              <Text style={styles.sideBtnText}>{lang}</Text>
            </Pressable>

            <Pressable
              style={({ focused }) => [styles.sideBtn, focused && styles.focusedSideBtn]}
              onPress={toggleNum}
            >
              <Text style={styles.sideBtnText}>&123</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 15 },

  searchContainer: {
    height: scaledPixels(64),
    flexDirection: 'row'
  },
  searchBarInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: scaledPixels(25),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scaledPixels(10),
    paddingHorizontal: scaledPixels(20),
    marginBottom: scaledPixels(15),
    justifyContent: 'space-between'
  },
  searchBarInputPlaceholder: { color: AppTheme.colors.subtext, fontSize: scaledPixels(18) },

  content: { flexDirection: 'row', flex: 1 },

  suggestion: {
    paddingVertical: scaledPixels(10),
    paddingHorizontal: scaledPixels(15),
    borderRadius: scaledPixels(20),
    marginBottom: scaledPixels(8),
    backgroundColor: AppTheme.colors.surface
  },
  focusedSuggestion: { backgroundColor: AppTheme.colors.text },
  suggestionText: { color: AppTheme.colors.surface, fontSize: scaledPixels(16) },

  keyboardContainer: { marginLeft: scaledPixels(30) },
  keyboardRow: { flexDirection: 'row', marginBottom: scaledPixels(8) },
  key: {
    backgroundColor: AppTheme.colors.surface,
    margin: scaledPixels(3),
    paddingVertical: scaledPixels(12),
    paddingHorizontal: scaledPixels(15),
    borderRadius: scaledPixels(6)
  },
  keyWide: {
    backgroundColor: AppTheme.colors.surface,
    margin: scaledPixels(3),
    paddingVertical: scaledPixels(12),
    paddingHorizontal: scaledPixels(25),
    borderRadius: scaledPixels(6)
  },
  focusedKey: { borderColor: AppTheme.colors.text, borderWidth: scaledPixels(2) },
  keyText: { color: AppTheme.colors.text, fontSize: scaledPixels(18) },

  sideButtons: {
    position: 'absolute',
    right: -scaledPixels(60),
    top: 0,
    justifyContent: 'flex-start'
  },
  sideBtn: {
    backgroundColor: 'transparent',
    padding: scaledPixels(10),
    borderRadius: scaledPixels(6),
    marginBottom: scaledPixels(10)
  },
  focusedSideBtn: { borderColor: AppTheme.colors.text, borderWidth: scaledPixels(2) },
  sideBtnText: { color: AppTheme.colors.text, fontSize: scaledPixels(16) }
});
