import { StyledIcon } from '@/components/StyledIcon';
import { AppTheme } from '@/constants/theme.constant';
import { scaledPixels } from '@/hooks/useScaledPixels';
import { IconType } from '@/types/icons.type';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Pressable, StyleSheet, Text, View } from 'react-native';

interface AccordionProps {
  sections: AccordionSection[];
}

interface AccordionItemProps {
  icon?: IconType;
  title: string;
  subtitle?: string;
  children: ReactNode;
  isActive: boolean;
  onPress: () => void;
}

const AccordionItem = ({
  icon,
  title,
  subtitle,
  children,
  isActive,
  onPress
}: AccordionItemProps) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [isActive]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg']
  });

  return (
    <>
      <Pressable
        focusable
        onPress={onPress}
        style={({ focused }) => [styles.header, focused && { opacity: 0.8 }]}
      >
        {({ focused }) => (
          <>
            <StyledIcon
              icon={icon ? icon : 'cog-outline'}
              size="xlarge"
              color={focused ? AppTheme.colors.primary : AppTheme.colors.text}
              style={styles.headerIcon}
            />
            <View style={styles.headerBlock}>
              <Text style={styles.headerText}>{title}</Text>
              {subtitle ? <Text style={styles.headerSubText}>{subtitle}</Text> : null}
            </View>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <StyledIcon
                icon="chevron-right"
                size="normal"
                color={focused ? AppTheme.colors.primary : AppTheme.colors.subtext}
              />
            </Animated.View>
          </>
        )}
      </Pressable>
      {isActive && <View style={styles.content}>{children}</View>}
    </>
  );
};

export interface AccordionSection {
  icon?: IconType;
  title: string;
  subtitle?: string;
  content: ReactNode;
}

export const StyledAccordion = ({ sections }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePress = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {sections.map((section, index) => (
        <AccordionItem
          key={`accordion-item-${index}`}
          icon={section.icon}
          title={section.title}
          subtitle={section.subtitle}
          isActive={activeIndex === index}
          onPress={() => handlePress(index)}
        >
          {section.content}
        </AccordionItem>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaledPixels(12),
    borderBottomWidth: scaledPixels(0.5),
    borderBottomColor: AppTheme.colors.border
  },
  headerBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  headerIcon: {
    marginRight: scaledPixels(15)
  },
  headerText: {
    color: AppTheme.colors.text,
    fontSize: scaledPixels(22),
    fontWeight: 'bold'
  },
  headerSubText: {
    color: AppTheme.colors.subtext,
    fontSize: scaledPixels(18),
    marginTop: scaledPixels(2)
  },
  content: {
    padding: scaledPixels(15)
  }
});
