import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProductsNavigator} from './ProductsNavigator';
import {LoginScreen} from '../screens/LoginScreen';
import {SignUpScreen} from '../screens/SignUpScreen';
import {LoadingScreen} from '../screens/LoadingScreen';
import {AuthContext} from '../context/AuthContext';

export type NavigatorStackParams = {
  Loading: undefined;
  Login: undefined;
  SignUp: undefined;
  ProductsNavigator: undefined;
};

const Stack = createStackNavigator<NavigatorStackParams>();

export const Navigator = () => {
  const {status} = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {status === 'checking' && (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      )}

      {status !== 'authenticated' ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <Stack.Screen name="ProductsNavigator" component={ProductsNavigator} />
      )}
    </Stack.Navigator>
  );
};
