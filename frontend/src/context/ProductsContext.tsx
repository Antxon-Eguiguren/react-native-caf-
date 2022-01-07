import React, {createContext, useEffect, useState} from 'react';
import {ImagePickerResponse} from 'react-native-image-picker';
import {Product, ProductsResponse} from '../interfaces/Product';
import api from '../api/api';

type ProductsContextProps = {
  products: Product[];
  loadProducts: () => void;
  loadProductById: (productId: string) => Promise<Product>;
  addProduct: (categoryId: string, productName: string) => void;
  updateProduct: (catId: string, name: string, prodId: string) => void;
  deleteProduct: (productId: string) => void;
  uploadImage: (data: any, productId: string) => void;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await api.get<ProductsResponse>('/productos?limite=50');
    setProducts([...response.data.productos]);
  };

  const loadProductById = async (productId: string): Promise<Product> => {
    const response = await api.get<Product>(`/productos/${productId}`);
    return response.data;
  };

  const addProduct = async (categoryId: string, productName: string) => {
    try {
      const response = await api.post<Product>('/productos', {
        nombre: productName,
        categoria: categoryId,
      });
      setProducts([...products, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async (catId: string, name: string, prodId: string) => {
    try {
      const response = await api.put<Product>(`/productos/${prodId}`, {
        nombre: name,
        categoria: catId,
      });
      setProducts(
        products.map(product =>
          product._id === prodId ? response.data : product,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await api.delete(`/productos/${productId}`);
      if (response.status === 200) {
        loadProducts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (data: ImagePickerResponse, productId: string) => {
    const fileToUpload = {
      uri: data.assets![0].uri,
      type: data.assets![0].type,
      name: data.assets![0].fileName,
    };

    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    try {
      await api.put(`uploads/productos/${productId}`, formData);
    } catch (error) {}
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        loadProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
