import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [fridge, setFridge] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    dietType: '',
    area: '',
    allergies: [],
  });

  return (
    <AppContext.Provider value={{ fridge, setFridge, profile, setProfile }}>
      {children}
    </AppContext.Provider>
  );
};
