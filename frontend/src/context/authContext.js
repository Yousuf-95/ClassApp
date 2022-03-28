import React, { useState, createContext } from 'react';


const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {

    let [authState, setAuthState] = useState({
        userInfo: {},
        isAuthenticated: false
    });

    const setAuthInfo = ({ userInfo }) => {
        setAuthState({
            userInfo,
            isAuthenticated: userInfo.username ? true : false
        });
    }

    const logout = async () => {
        try {
            setAuthState({
                username: {},
                isAuthenticated: false
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Provider
            value={{
                authState,
                setAuthState: authInfo => setAuthInfo(authInfo),
                logout
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };