// Vuex type declarations for this project
import type { Product, ProductsState, CartState, CartItem, CartProduct } from '@/types';

export interface RootState {
  products: ProductsState;
  cart: CartState;
}

export interface ProductsGetters {
  'products/allProducts': Product[];
  'products/availableProducts': Product[];
  'products/productIsInStock': (product: Product) => boolean;
  'products/getProductById': (id: number) => Product | null;
}

export interface CartGetters {
  'cart/cartProducts': CartProduct[];
  'cart/cartTotal': number;
  'cart/cartItemCount': number;
}

export interface AllGetters extends ProductsGetters, CartGetters {}

// Store module types
export type { Product, ProductsState, CartState, CartItem, CartProduct };
