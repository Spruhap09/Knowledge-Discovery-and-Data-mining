import React, { ReactNode, createContext, useState } from 'react';

// Initial state for theme
const initialState = {
  darkmode: false,
  toggleMode: () => {},
};

// Context 
export const ThemeContext = createContext(initialState);

// Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkmode, setDarkmode] = useState(false);

  const toggleMode = () => {
    setDarkmode(!darkmode);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkmode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};