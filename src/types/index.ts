/**
 * Shared type definitions for the application
 */

export interface Product {
  id: number;
  title: string;
  price: number;
  inventory: number;
  image?: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  checkoutStatus: string | null;
}

export interface TransactionResult {
  success: true;
  transaction: {
    id: string;
  };
}
