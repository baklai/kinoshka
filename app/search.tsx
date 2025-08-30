import SpeechButton from '@/components/SpeechButton';
import { StyledIcon } from '@/components/StyledIcon';
import { KEYBOARD, LanguageCode } from '@/constants/keyboard.constant';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { transpose } from '@/utils';
import * as Localization from 'expo-localization';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View
} from 'react-native';

export default function SearchScreen() {
  const { width, height } = useWindowDimensions();

  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([
    'Дулітл',
    'Хижі пташки',
    'Нова Людина-Павук',
    'Ван Хелсінг',
    'Індіана Джонс: У пошуках втраченого ковчега',
    'Водій для копа',
    'Гаррі Поттер і таємна кімната'
  ]);
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

  const orientation = useMemo<'portrait' | 'landscape'>(() => {
    return height >= width ? 'portrait' : 'landscape';
  }, [width, height]);

  const toggleLang = () => {
    if (lang === 'UA') setLang('RU');
    else if (lang === 'RU') setLang('EN');
    else if (lang === 'EN') setLang('UA');
  };

  const toggleNum = () => {
    setLang(lang === 'NUM' ? 'UA' : 'NUM');
  };

  const handleKeyPress = (key: string) => {
    setQuery(prev => prev + key);
  };

  const handleVoiceSearch = () => {
    ToastAndroid.show('Голосовий пошук ще не реалізовано!', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <SpeechButton onPress={handleVoiceSearch} />
        <View style={styles.searchSectionInput}>
          <Text style={styles.searchSectionInputText}>{query || 'Пошук...'}</Text>
        </View>
      </View>

      <View
        style={[
          styles.mainSection,
          orientation === 'portrait' && { flex: 1, flexDirection: 'column' }
        ]}
      >
        <View style={[styles.suggestionSection, { maxHeight: scaledPixels(240) }]}>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {suggestions.map((item, idx) => {
              return (
                <Pressable
                  key={`suggestions-${idx}`}
                  style={({ focused, pressed }) => [
                    styles.suggestionItem,
                    orientation === 'portrait' && { alignSelf: 'auto' },
                    pressed && { opacity: 0.7 },
                    focused && { backgroundColor: AppTheme.colors.primary }
                  ]}
                  onPress={() => setQuery(item)}
                >
                  {({ focused }) => (
                    <>
                      <StyledIcon icon="history" />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.suggestionText, focused && { fontWeight: 'bold' }]}
                      >
                        {item}
                      </Text>
                    </>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View
          style={[
            styles.keyboardSection,
            orientation === 'portrait' && { alignItems: 'center', justifyContent: 'center' }
          ]}
        >
          {transpose(KEYBOARD[lang]).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((key: string) => (
                <Pressable
                  key={key}
                  onPress={() => handleKeyPress(key)}
                  style={({ focused, pressed }) => [
                    styles.key,
                    focused && styles.focusedKey,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  {({ focused }) => (
                    <Text
                      style={[
                        styles.keyText,
                        focused && { color: AppTheme.colors.surface, fontWeight: 'bold' }
                      ]}
                    >
                      {key}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          <View style={styles.keyboardRow}>
            <Pressable
              style={({ focused, pressed }) => [
                styles.key,
                focused && styles.focusedKey,
                pressed && { opacity: 0.7 }
              ]}
              onPress={() => setQuery(prev => (prev.length > 0 ? prev.slice(0, -1) : prev))}
            >
              {({ focused }) => (
                <StyledIcon
                  icon="backspace-outline"
                  color={focused ? AppTheme.colors.surface : AppTheme.colors.subtext}
                />
              )}
            </Pressable>

            <Pressable
              style={({ focused, pressed }) => [
                styles.key,
                focused && styles.focusedKey,
                pressed && { opacity: 0.7 }
              ]}
              onPress={toggleNum}
            >
              {({ focused }) => (
                <StyledIcon
                  icon="numeric"
                  color={focused ? AppTheme.colors.surface : AppTheme.colors.subtext}
                />
              )}
            </Pressable>

            <Pressable
              style={({ focused, pressed }) => [
                styles.key,
                focused && styles.focusedKey,
                pressed && { opacity: 0.7 }
              ]}
              onPress={toggleLang}
            >
              {({ focused }) => (
                <StyledIcon
                  icon="web"
                  color={focused ? AppTheme.colors.surface : AppTheme.colors.subtext}
                />
              )}
            </Pressable>

            {lang !== 'NUM' && (
              <Pressable
                style={({ focused, pressed }) => [
                  styles.key,
                  focused && styles.focusedKey,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => setQuery(prev => prev + ' ')}
              >
                {({ focused }) => (
                  <StyledIcon
                    icon="keyboard-space"
                    color={focused ? AppTheme.colors.surface : AppTheme.colors.subtext}
                  />
                )}
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginVertical: scaledPixels(10) }}>
        {/* {query.length >= 3 && <MoviesFlatList filters={{ title: query }} />} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaledPixels(10)
  },
  searchSectionInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: scaledPixels(48),
    justifyContent: 'space-between',
    borderRadius: scaledPixels(48),
    marginLeft: scaledPixels(10),
    paddingHorizontal: scaledPixels(20),
    backgroundColor: AppTheme.colors.card
  },
  searchSectionInputText: {
    color: AppTheme.colors.subtext,
    fontSize: scaledPixels(18),
    fontWeight: 'bold'
  },

  mainSection: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  suggestionSection: {
    flex: 1,
    paddingVertical: scaledPixels(10)
  },
  suggestionItem: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingVertical: scaledPixels(6),
    paddingHorizontal: scaledPixels(10),
    borderRadius: scaledPixels(20),
    marginBottom: scaledPixels(8),
    backgroundColor: AppTheme.colors.surface
  },
  suggestionText: {
    maxWidth: '90%',
    color: AppTheme.colors.text,
    fontSize: scaledPixels(16),
    paddingHorizontal: scaledPixels(8)
  },

  keyboardSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  keyboardRow: {
    flexDirection: 'column',
    marginBottom: scaledPixels(6)
  },

  key: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: scaledPixels(3),
    paddingVertical: scaledPixels(10),
    paddingHorizontal: scaledPixels(15),
    borderRadius: scaledPixels(6)
  },
  keyText: {
    color: AppTheme.colors.text,
    fontSize: scaledPixels(18)
  },
  focusedKey: {
    backgroundColor: AppTheme.colors.text
  }
});
