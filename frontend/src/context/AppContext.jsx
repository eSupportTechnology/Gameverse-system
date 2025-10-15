import React, { createContext, useContext, useState, useEffect } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

  const [loggedUser, setLoggedUser] = useState(null);
  

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData) => {
    setLoggedUser(userData);
    localStorage.setItem("loggedUser", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("aToken");
    localStorage.removeItem("oToken");
    localStorage.removeItem("loginRole");
  };

  const value = {
    loggedUser, loginUser, logoutUser
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
