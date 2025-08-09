import { ApplicationContext, ApplicationContextType } from '@/context/ApplicationContext';
import { ReactNode, useContext, useState } from 'react';

export const useApplication = () => useContext(ApplicationContext);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const clearCategory = () => {
    setSelectedCategory('');
    setCategoryDescription('');
  };

  const contextValue: ApplicationContextType = {
    selectedCategory,
    setSelectedCategory,
    categoryDescription,
    setCategoryDescription,
    clearCategory
  };

  return <ApplicationContext.Provider value={contextValue}>{children}</ApplicationContext.Provider>;
};
