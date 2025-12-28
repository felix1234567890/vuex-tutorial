import shop from "@/api/shop";

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

// Products module with namespaced true for better encapsulation
export default {
  namespaced: true,

  state: (): ProductsState => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Get all products
     */
    allProducts(state): Product[] {
      return state.items;
    },

    /**
     * Get only products that are in stock
     */
    availableProducts(state): Product[] {
      return state.items.filter(product => product.inventory > 0);
    },

    /**
     * Check if a product is in stock
     */
    productIsInStock: () => (product: Product) => {
      return product && product.inventory > 0;
    },

    /**
     * Get a product by ID
     */
    getProductById: (state) => (id: number): Product | null => {
      return state.items.find(product => product.id === id) || null;
    }
  },

  actions: {
    /**
     * Fetch all products from the API
     */
    fetchProducts({ commit }) {
      // Set loading state
      commit('setLoading', true);
      commit('setError', null);

      return shop
        .getProducts()
        .then((products: Product[]) => {
          commit('setProducts', products);
          return products;
        })
        .catch((err: Error) => {
          commit('setError', err.message || err);
          throw err;
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },

    /**
     * Add a new product (example action)
     */
    addProduct({ commit }, product: Product) {
      // In a real app, this would call an API
      commit('addProduct', product);
    }
  },

  mutations: {
    /**
     * Set the products array
     */
    setProducts(state: ProductsState, products: Product[]) {
      state.items = products;
    },

    /**
     * Set loading state
     */
    setLoading(state: ProductsState, status: boolean) {
      state.loading = status;
    },

    /**
     * Set error state
     */
    setError(state: ProductsState, error: string | null) {
      state.error = error;
    },

    /**
     * Decrement product inventory
     */
    decrementInventory(state: ProductsState, productId: number) {
      const productInState = state.items.find(p => p.id === productId);
      if (productInState && productInState.inventory > 0) {
        productInState.inventory--;
      }
    },

    /**
     * Add a new product
     */
    addProduct(state: ProductsState, product: Product) {
      state.items.push(product);
    }
  }
};
