// src/context/AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: '',
    dietType: '',
    area: '',
    allergies: [],
  });
  const [fridge, setFridge] = useState([]);
  const [groups, setGroups] = useState([]);

  return (
    <AppContext.Provider value={{ profile, setProfile, fridge, setFridge, groups, setGroups }}>
      {children}
    </AppContext.Provider>
  );
};
