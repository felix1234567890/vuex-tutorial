import { createStore } from 'vuex';

// Import store modules
import cart from "@/store/modules/cart";
import products from "@/store/modules/products";

// Create and export the store
export default createStore({
  modules: {
    cart,
    products
  },
  // Enable strict mode in development
  strict: process.env.NODE_ENV !== 'production'
});
