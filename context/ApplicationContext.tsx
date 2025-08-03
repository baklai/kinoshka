import { createContext } from 'react';

export interface ApplicationContextType {
  selectedCategory: string;
  setSelectedCategory: (name: string) => void;

  categoryDescription: string;
  setCategoryDescription: (description: string) => void;

  clearCategory: () => void;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  selectedCategory: '',
  setSelectedCategory: () => {},
  categoryDescription: '',
  setCategoryDescription: () => {},
  clearCategory: () => {}
});
