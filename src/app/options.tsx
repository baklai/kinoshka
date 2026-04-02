import React, { useCallback, useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TVFocusGuideView, View } from 'react-native';

import { AccordionSection, StyledAccordion } from '@/components/StyledAccordion';
import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/ui.constant';
import { AppContext, SERVICES } from '@/context';
import { useStorage } from '@/context/storage';
import { IconType } from '@/types/icons.type';

const ServiceSelector = () => {
  const { id: activeId, setService } = useContext(AppContext);

  return (
    <View>
      <Text style={styles.sectionLabel}>Джерело відео</Text>
      {Object.values(SERVICES).map(service => {
        const isSelected = service.id === activeId;
        return (
          <Pressable
            key={service.id}
            focusable
            onPress={() => setService(service.id)}
            style={({ focused }) => [styles.row, focused && styles.rowFocused]}
          >
            <StyledIcon
              icon={(isSelected ? 'radiobox-marked' : 'radiobox-blank') as IconType}
              size="large"
              color={isSelected ? AppTheme.colors.primary : AppTheme.colors.subtext}
              style={styles.rowIcon}
            />
            <Text style={[styles.rowText, isSelected && styles.rowTextActive]}>{service.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

type ClearButtonProps = {
  icon: IconType;
  label: string;
  description: string;
  confirmTitle: string;
  confirmMessage: string;
  onConfirm: () => Promise<void>;
};

const ClearButton = ({
  icon,
  label,
  description,
  confirmTitle,
  confirmMessage,
  onConfirm
}: ClearButtonProps) => {
  const [done, setDone] = useState(false);

  const handlePress = useCallback(() => {
    Alert.alert(confirmTitle, confirmMessage, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Очистити',
        style: 'destructive',
        onPress: async () => {
          await onConfirm();
          setDone(true);
          setTimeout(() => setDone(false), 3000);
        }
      }
    ]);
  }, [confirmTitle, confirmMessage, onConfirm]);

  return (
    <Pressable
      focusable
      onPress={handlePress}
      style={({ focused }) => [styles.row, focused && styles.rowFocused]}
    >
      <StyledIcon
        icon={done ? ('check-circle-outline' as IconType) : icon}
        size="large"
        color={done ? AppTheme.colors.primary : AppTheme.colors.subtext}
        style={styles.rowIcon}
      />
      <View style={styles.rowBody}>
        <Text style={styles.rowText}>{label}</Text>
        <Text style={styles.rowSubText}>{description}</Text>
      </View>
      <StyledIcon
        icon={'delete-outline' as IconType}
        size="normal"
        color={AppTheme.colors.subtext}
      />
    </Pressable>
  );
};

const StorageManager = () => {
  const { bookmarks, clearBookmarks, clearHistory } = useStorage();

  return (
    <View>
      <Text style={styles.sectionLabel}>Очистити дані</Text>

      <ClearButton
        icon={'bookmark-multiple-outline' as IconType}
        label="Закладки"
        description={`${bookmarks.length} збережених фільмів`}
        confirmTitle="Очистити закладки?"
        confirmMessage="Всі збережені закладки буде видалено. Цю дію неможливо скасувати."
        onConfirm={clearBookmarks}
      />

      <ClearButton
        icon={'history' as IconType}
        label="Історія перегляду"
        description="Записи про переглянуті фільми"
        confirmTitle="Очистити історію?"
        confirmMessage="Всю історію перегляду буде видалено. Цю дію неможливо скасувати."
        onConfirm={clearHistory}
      />
    </View>
  );
};

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
    content: <ServiceSelector />
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
    subtitle: 'Керування збереженими даними (історія, закладки)',
    content: <StorageManager />
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
    paddingHorizontal: spacing(0.5),
    borderRadius: 8
  },
  rowFocused: {
    opacity: 0.8
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
  rowTextActive: {
    color: AppTheme.colors.primary,
    fontWeight: 'bold'
  },
  rowSubText: {
    color: AppTheme.colors.subtext,
    fontSize: typography.md,
    marginTop: spacing(0.25)
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
