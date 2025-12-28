import shop from '@/api/shop';
import { defineStore } from 'pinia';

export interface Product {
  id: number;
  title: string;
  price: number;
  inventory: number;
  image?: string;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    allProducts: (state): Product[] => state.items,

    availableProducts: (state): Product[] =>
      state.items.filter((product) => product.inventory > 0),

    productIsInStock: () => (product: Product): boolean =>
      product && product.inventory > 0,

    getProductById: (state) => (id: number): Product | null =>
      state.items.find((product) => product.id === id) || null,
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const products = await shop.getProducts()
        this.items = products
      } catch (err) {
        this.error = err as string
      } finally {
        this.loading = false
      }
    },

    addProduct(product: Product) {
      // In a real app, this would call an API
      this.items.push(product)
    },

    setProducts(products: Product[]) {
      this.items = products
    },

    setLoading(status: boolean) {
      this.loading = status
    },

    setError(error: string | null) {
      this.error = error
    },

    decrementInventory(productOrId: Product | number) {
      const productId = typeof productOrId === 'number' ? productOrId : productOrId.id
      const productInState = this.items.find((p) => p.id === productId)
      if (productInState && productInState.inventory > 0) {
        productInState.inventory--
      }
    },
  },
})
