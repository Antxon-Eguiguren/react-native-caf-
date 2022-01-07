import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/navigator/Navigator';
import {AuthProvider} from './src/context/AuthContext';
import {ProductsProvider} from './src/context/ProductsContext';

export const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ProductsProvider>
          <Navigator />
        </ProductsProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};
