import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {ProductsContext} from '../context/ProductsContext';
import {AuthContext} from '../context/AuthContext';
import {FormStyles} from '../styles/FormStyles';

interface Props extends StackScreenProps<ProductsStackParams, 'Products'> {}

export const ProductsScreen = ({navigation}: Props) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const {products, loadProducts} = useContext(ProductsContext);
  const {logout} = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{...FormStyles.buttonContainer, flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[FormStyles.button, styles.buttonContainer]}
            onPress={logout}>
            <Text style={FormStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[FormStyles.button, styles.buttonContainer]}
            onPress={() =>
              navigation.navigate('Product', {
                id: undefined,
                name: 'New Product',
              })
            }>
            <Text style={FormStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, logout]);

  const loadProductsFromBackend = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={product => product._id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadProductsFromBackend}
          />
        }
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Product', {id: item._id, name: item.nombre})
            }>
            <Text style={styles.productName}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  productName: {
    fontSize: 20,
  },
  itemSeparator: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginVertical: 5,
  },
  buttonContainer: {
    marginRight: 15,
  },
});
