import React from 'react';
import { StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

import { AccordionSection, StyledAccordion } from '@/components/StyledAccordion';
import { AppTheme } from '@/constants/theme.constant';
import { IconType } from '@/types/icons.type';

const ComingSoon = ({ label }: { label: string }) => (
  <View style={styles.comingSoon}>
    <Text style={styles.comingSoonText}>{label}</Text>
  </View>
);

const sections: AccordionSection[] = [
  {
    icon: 'video' as IconType,
    title: 'Відео',
    subtitle: 'Налаштування плеєра та джерел відео',
    content: <ComingSoon label="Налаштування відео — незабаром" />
  },
  {
    icon: 'movie-roll' as IconType,
    title: 'Каталог',
    subtitle: 'Налаштування каталогу фільмів/серіалів',
    content: <ComingSoon label="Налаштування каталогу — незабаром" />
  },
  {
    icon: 'theme-light-dark' as IconType,
    title: 'Вигляд та поведінка',
    subtitle: 'Тема, сортування',
    content: <ComingSoon label="Налаштування вигляду — незабаром" />
  },
  {
    icon: 'content-save' as IconType,
    title: 'Збережені дані',
    subtitle: 'Керування збереженими даними (історія, кеш, закладки)',
    content: <ComingSoon label="Керування даними — незабаром" />
  }
];

export default function OptionsScreen() {
  return (
    <TVFocusGuideView style={styles.container} trapFocusLeft trapFocusRight trapFocusDown>
      <StyledAccordion sections={sections} />
    </TVFocusGuideView>
  );
}

const { spacing, typography } = AppTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  comingSoon: {
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(1),
    alignItems: 'center'
  },
  comingSoonText: {
    color: AppTheme.colors.subtext,
    fontSize: typography.md,
    fontStyle: 'italic'
  }
});
