import React, {createContext, useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthReducer, AuthState} from './AuthReducer';
import {LoginData, LoginResponse, SignUpData, User} from '../interfaces/User';
import api from '../api/api';

type AuthContextProps = {
  user: User | null;
  token: string | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  loginError: string;
  signUpError: string;
  signUp: (signUpData: SignUpData) => void;
  login: (loginData: LoginData) => void;
  logout: () => void;
  removeErrors: () => void;
};

const AuthInitialState: AuthState = {
  user: null,
  token: null,
  status: 'checking',
  loginError: null,
  signUpError: null,
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(AuthReducer, AuthInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // Check if token exists...
      if (!token) {
        return dispatch({type: 'notAuthenticated'});
      }

      // Check if token is valid...
      const response = await api.get('/auth');
      if (response.status !== 200) {
        return dispatch({type: 'notAuthenticated'});
      }

      // Token exists and is valid... backend generates a new token
      await AsyncStorage.setItem('token', response.data.token);
      dispatch({
        type: 'login',
        payload: {
          token: response.data.token,
          user: response.data.usuario,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const signUp = async ({nombre, correo, password}: SignUpData) => {
    try {
      const response = await api.post<LoginResponse>('usuarios', {
        nombre,
        correo,
        password,
      });

      dispatch({
        type: 'signup',
        payload: {
          token: response.data.token,
          user: response.data.usuario,
        },
      });
      await AsyncStorage.setItem('token', response.data.token);
    } catch (error: any) {
      dispatch({
        type: 'addSignUpError',
        payload: error.response.data.errors[0].msg || 'Signup error',
      });
    }
  };

  const login = async ({correo, password}: LoginData) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });

      dispatch({
        type: 'login',
        payload: {
          token: response.data.token,
          user: response.data.usuario,
        },
      });
      await AsyncStorage.setItem('token', response.data.token);
    } catch (error: any) {
      dispatch({
        type: 'addLoginError',
        payload: error.response.data.msg || 'Login error',
      });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logout'});
  };

  const removeErrors = () => {
    dispatch({type: 'removeErrors'});
  };

  return (
    <AuthContext.Provider
      value={{...state, signUp, login, logout, removeErrors}}>
      {children}
    </AuthContext.Provider>
  );
};
