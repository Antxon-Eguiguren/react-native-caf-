export interface CategoriesResponse {
  total: number;
  categorias: Category[];
}

export interface Category {
  _id: string;
  nombre: string;
  usuario: Usuario;
}

export interface Usuario {
  _id: string;
  nombre: string;
}
