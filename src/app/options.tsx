import { AccordionSection, StyledAccordion } from '@/components/StyledAccordion';
import { IconType } from '@/types/icons.type';
import React from 'react';
import { StyleSheet, TVFocusGuideView, View } from 'react-native';

const sections: AccordionSection[] = [
  {
    icon: 'video' as IconType,
    title: 'Відео',
    subtitle: 'Налаштування плеєра та джерел відео',
    content: <View></View>
  },
  {
    icon: 'movie-roll' as IconType,
    title: 'Каталог',
    subtitle: 'Налаштування каталогу фільмів/серіалів',
    content: <View></View>
  },
  {
    icon: 'theme-light-dark' as IconType,
    title: 'Вигляд та поведінка',
    subtitle: 'Тема, сортування',
    content: <View></View>
  },
  {
    icon: 'content-save' as IconType,
    title: 'Збережені дані',
    subtitle: 'Керування збереженими даними (історія, кеш, закладки)',
    content: <View></View>
  }
];

export default function OptionsScreen() {
  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <StyledAccordion sections={sections} />
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
