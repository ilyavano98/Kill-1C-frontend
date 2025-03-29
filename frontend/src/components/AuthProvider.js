import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
    isAuth: false,
    setIsAuth: () => {}
});

export const useAuthState = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    );
};