import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {FormStyles} from '../styles/FormStyles';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'Product'> {}

export const ProductScreen = ({route: {params}, navigation}: Props) => {
  const [tempImgUri, setTempImgUri] = useState<string>('');
  const {categories, isLoading, error} = useCategories();
  const {
    loadProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  } = useContext(ProductsContext);
  const {nombre, categoriaId, img, onChange, setFormValues} = useForm({
    _id: params.id,
    categoriaId: '',
    nombre: params.name,
    img: '',
  });

  useEffect(() => {
    isLoading ? null : loadProduct();
  }, [isLoading]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: nombre ? nombre : 'Product name',
    });
  }, [navigation, params.name, nombre]);

  const loadProduct = async () => {
    if (!params.id) {
      return;
    }
    const product = await loadProductById(params.id);
    setFormValues({
      _id: params.id,
      categoriaId: product.categoria._id,
      nombre: params.name,
      img: product.img || '',
    });
  };

  const saveOrUpdate = () => {
    if (params.id) {
      updateProduct(categoriaId, nombre!, params.id);
      navigation.navigate('Products');
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      addProduct(tempCategoriaId, nombre!);
      navigation.navigate('Products');
    }
  };

  const takePhoto = async () => {
    const response = await launchCamera({mediaType: 'photo', quality: 0.5});

    if (response.didCancel || !response.assets![0].uri) {
      return;
    }

    setTempImgUri(response.assets![0].uri);
    uploadImage(response, params.id!);
  };

  const uploadPhotoFromLibrary = async () => {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.5,
    });

    if (response.didCancel || !response.assets![0].uri) {
      return;
    }

    setTempImgUri(response.assets![0].uri);
    uploadImage(response, params.id!);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Product name:</Text>
        <TextInput
          style={{
            ...FormStyles.inputField,
            ...(Platform.OS === 'ios' && FormStyles.inputFieldIOS),
            color: 'black',
            marginBottom: 30,
          }}
          placeholder={params ? params.name : 'Product name'}
          keyboardType="default"
          underlineColorAndroid="black"
          selectionColor="salmon"
          autoCapitalize="none"
          autoCorrect={false}
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />

        <Text style={styles.label}>Product category:</Text>
        {isLoading && <ActivityIndicator size={30} color="black" />}
        {error && <Text>{error}</Text>}
        {categories && (
          <Picker
            selectedValue={categoriaId}
            onValueChange={value => onChange(value, 'categoriaId')}>
            {categories.map(category => (
              <Picker.Item
                label={category.nombre}
                value={category._id}
                key={category._id}
              />
            ))}
          </Picker>
        )}

        <View style={{marginTop: 20}}>
          <Button
            title={params.id ? 'Update product' : 'Save product'}
            color="#5856D6"
            onPress={saveOrUpdate}
          />
        </View>

        {params.id && (
          <View style={{marginTop: 20}}>
            <Button
              title="Delete product"
              color="#BD1816"
              onPress={() => {
                deleteProduct(params.id!);
                navigation.navigate('Products');
              }}
            />
          </View>
        )}

        {params.id && (
          <View style={styles.buttonsContainer}>
            <Button title="Camera" color="#5856D6" onPress={takePhoto} />
            <Button
              title="Gallery"
              color="#5856D6"
              onPress={uploadPhotoFromLibrary}
            />
          </View>
        )}

        {img.length > 0 && tempImgUri.length === 0 && (
          <View style={styles.imgContainer}>
            <Image source={{uri: img}} style={styles.img} />
          </View>
        )}

        {tempImgUri.length > 0 && (
          <View style={styles.imgContainer}>
            <Image source={{uri: tempImgUri}} style={styles.img} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  imgContainer: {
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: 500,
    marginVertical: 60,
  },
});
