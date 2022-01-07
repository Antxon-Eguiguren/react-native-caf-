import {useEffect, useState} from 'react';
import {CategoriesResponse, Category} from '../interfaces/Categories';
import api from '../api/api';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await api.get<CategoriesResponse>('/categorias');
      setCategories(response.data.categorias);
      setIsLoading(false);
      setError(null);
    } catch (err: any) {
      setIsLoading(false);
      setError(err);
    }
  };

  return {categories, isLoading, error};
};
