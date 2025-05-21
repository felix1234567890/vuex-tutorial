import { createStore } from 'vuex';

import cart from "./modules/cart";
import products from "./modules/products";

export default createStore({
  modules: { cart, products },
});
