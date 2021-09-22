import React, { createContext, useContext, useReducer } from "react";

// Creating Data Layer
export const StateContext = createContext();

// Children = App
export const StateProvider = ({ reducer, initialState, children }) => (
  // Set Data Layer
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Pull info from data layer
export const useStateValue = () => useContext(StateContext);
