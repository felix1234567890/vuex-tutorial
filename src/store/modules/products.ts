import shop from "@/api/shop";
import type { Product, ProductsState } from "@/types";

// Action context type for this module
interface ProductsActionContext {
  commit: (mutation: string, payload?: any) => void;
}

// Products module with namespaced true for better encapsulation
const productsModule = {
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
    allProducts(state: ProductsState): Product[] {
      return state.items;
    },

    /**
     * Get only products that are in stock
     */
    availableProducts(state: ProductsState): Product[] {
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
    getProductById: (state: ProductsState) => (id: number): Product | null => {
      return state.items.find(product => product.id === id) || null;
    }
  },

  actions: {
    /**
     * Fetch all products from the API
     */
    async fetchProducts({ commit }: ProductsActionContext) {
      // Set loading state
      commit('setLoading', true);
      commit('setError', null);

      try {
        const products = await shop.getProducts();
        commit('setProducts', products);
        return products;
      } catch (err: any) {
        commit('setError', err.message || err);
        throw err;
      } finally {
        commit('setLoading', false);
      }
    },

    /**
     * Add a new product (example action)
     */
    addProduct({ commit }: ProductsActionContext, product: Product) {
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

export default productsModule;
